import { TaskNode, ExecutionGraph, SchedulerConfig } from './types';
import { TaskDefinition, WorkflowState } from '../types/workflow';

export class TaskScheduler {
  private maxConcurrent: number;
  private timeout: number;

  constructor(config: SchedulerConfig = {}) {
    this.maxConcurrent = config.maxConcurrent || 5;
    this.timeout = config.timeout || 30000; // 30 seconds default
  }

  private buildExecutionGraph(tasks: TaskDefinition[]): ExecutionGraph {
    const nodes = new Map<string, TaskNode>();
    const ready: string[] = [];

    // Initialize nodes
    tasks.forEach(task => {
      nodes.set(task.id, {
        id: task.id,
        dependencies: task.dependencies || [],
        executed: false,
        running: false
      });
    });

    // Find initial ready tasks (those with no dependencies)
    nodes.forEach((node, id) => {
      if (node.dependencies.length === 0) {
        ready.push(id);
      }
    });

    return {
      nodes,
      ready,
      completed: [],
      failed: []
    };
  }

  private updateGraph(graph: ExecutionGraph, taskId: string, success: boolean): string[] {
    const newReady: string[] = [];
    
    // Update task status
    const node = graph.nodes.get(taskId);
    if (node) {
      node.running = false;
      node.executed = true;
    }

    // Add to completed or failed list
    if (success) {
      graph.completed.push(taskId);
    } else {
      graph.failed.push(taskId);
    }

    // Find new ready tasks
    graph.nodes.forEach((node, id) => {
      if (node.executed || node.running) return;
      
      const allDependenciesCompleted = node.dependencies.every(depId => 
        graph.completed.includes(depId)
      );

      if (allDependenciesCompleted) {
        newReady.push(id);
      }
    });

    return newReady;
  }

  async executeTasks(
    tasks: TaskDefinition[],
    executeTask: (task: TaskDefinition) => Promise<void>,
    updateState: (state: Partial<WorkflowState>) => void
  ): Promise<void> {
    const graph = this.buildExecutionGraph(tasks);
    const running = new Set<string>();

    while (graph.ready.length > 0 || running.size > 0) {
      // Start new tasks up to maxConcurrent
      while (graph.ready.length > 0 && running.size < this.maxConcurrent) {
        const taskId = graph.ready.shift()!;
        const task = tasks.find(t => t.id === taskId)!;
        const node = graph.nodes.get(taskId)!;

        node.running = true;
        running.add(taskId);

        // Execute task with timeout
        this.executeTaskWithTimeout(task, executeTask, updateState)
          .then(() => {
            running.delete(taskId);
            const newReady = this.updateGraph(graph, taskId, true);
            graph.ready.push(...newReady);
          })
          .catch(error => {
            running.delete(taskId);
            node.error = error;
            this.updateGraph(graph, taskId, false);
          });
      }

      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Check if any tasks failed
    if (graph.failed.length > 0) {
      const failedTasks = graph.failed.map(id => {
        const node = graph.nodes.get(id);
        return `${id}: ${node?.error?.message || 'Unknown error'}`;
      });
      throw new Error(`Some tasks failed: ${failedTasks.join(', ')}`);
    }
  }

  private async executeTaskWithTimeout(
    task: TaskDefinition,
    executeTask: (task: TaskDefinition) => Promise<void>,
    updateState: (state: Partial<WorkflowState>) => void
  ): Promise<void> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Task ${task.id} timed out`)), this.timeout);
    });

    try {
      updateState({ currentTask: task.id });
      await Promise.race([executeTask(task), timeoutPromise]);
    } catch (error) {
      updateState({ error: error as Error });
      throw error;
    }
  }
}
