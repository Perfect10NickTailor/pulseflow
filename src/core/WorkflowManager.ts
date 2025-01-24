import { WorkflowDefinition, WorkflowState, TaskDefinition } from './types/workflow';
import { TaskScheduler } from './scheduler/TaskScheduler';
import { TriggerManager } from './triggers/TriggerManager';
import { TriggerConfig, TriggerContext } from './triggers/types';

export class WorkflowManager {
  private workflows: Map<string, WorkflowDefinition>;
  private workflowStates: Map<string, WorkflowState>;
  private scheduler: TaskScheduler;
  private triggerManager: TriggerManager;

  constructor() {
    this.workflows = new Map();
    this.workflowStates = new Map();
    this.scheduler = new TaskScheduler({ maxConcurrent: 3 });
    this.triggerManager = new TriggerManager();
  }

  async registerWorkflow(workflow: WorkflowDefinition): Promise<void> {
    this.workflows.set(workflow.id, workflow);
    this.workflowStates.set(workflow.id, {
      workflowId: workflow.id,
      status: 'idle',
      data: {}
    });

    // Register workflow triggers
    if (workflow.triggers) {
      for (const trigger of workflow.triggers) {
        await this.triggerManager.addTrigger({
          type: trigger.type,
          config: trigger.config,
          workflowId: workflow.id
        });
      }
    }
  }

  async handleTrigger(context: TriggerContext): Promise<void> {
    const result = await this.triggerManager.processTrigger(context);
    
    if (result.shouldExecute) {
      await this.executeWorkflow(context.workflowId, result.data || {});
    }
  }

  async executeWorkflow(workflowId: string, initialData: Record<string, any> = {}): Promise<WorkflowState> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const state = this.workflowStates.get(workflowId);
    if (!state) {
      throw new Error(`Workflow state ${workflowId} not found`);
    }

    try {
      state.status = 'running';
      state.data = initialData;

      await this.scheduler.executeTasks(
        workflow.tasks,
        async (task: TaskDefinition) => {
          console.log(`Executing task: ${task.id}`);
          // Simulate task execution
          await new Promise(resolve => setTimeout(resolve, 1000));
        },
        (updates: Partial<WorkflowState>) => {
          Object.assign(state, updates);
        }
      );

      state.status = 'completed';
      return state;
    } catch (error) {
      state.status = 'failed';
      state.error = error as Error;
      throw error;
    }
  }

  getWorkflowState(workflowId: string): WorkflowState | undefined {
    return this.workflowStates.get(workflowId);
  }
}
