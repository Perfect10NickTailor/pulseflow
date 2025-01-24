import { TaskDefinition } from '../../types/workflow';
import { TransformTask } from './TransformTask';

export class TaskExecutor {
  private taskHandlers: Map<string, (task: TaskDefinition, data: Record<string, any>) => Promise<any>>;
  private transformTask: TransformTask;

  constructor() {
    this.taskHandlers = new Map();
    this.transformTask = new TransformTask();
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers() {
    // Register log task handler
    this.taskHandlers.set('log', async (task: TaskDefinition, data: Record<string, any>) => {
      console.log(`[Task ${task.id}]:`, task.config.message);
      if (task.config.logData) {
        console.log('Current workflow data:', data);
      }
      return data;
    });

    // Register transform task handler
    this.taskHandlers.set('transform', async (task: TaskDefinition, data: Record<string, any>) => {
      return this.transformTask.execute(task, data);
    });
  }

  registerHandler(taskType: string, handler: (task: TaskDefinition, data: Record<string, any>) => Promise<any>) {
    this.taskHandlers.set(taskType, handler);
  }

  async executeTask(task: TaskDefinition, data: Record<string, any>): Promise<any> {
    const handler = this.taskHandlers.get(task.type);
    if (!handler) {
      throw new Error(`No handler registered for task type: ${task.type}`);
    }

    try {
      console.log(`Executing task: ${task.id} (${task.type})`);
      const result = await handler(task, data);
      console.log(`Task ${task.id} completed successfully`);
      return result;
    } catch (error) {
      console.error(`Task ${task.id} failed:`, error);
      throw error;
    }
  }
}
