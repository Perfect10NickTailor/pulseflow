export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  tasks: TaskDefinition[];
  triggers?: TriggerDefinition[];
}

export interface TaskDefinition {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  dependencies?: string[];
  next?: string[];
}

export interface TriggerDefinition {
  id: string;
  type: string;
  config: Record<string, any>;
}

export type WorkflowStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface WorkflowState {
  workflowId: string;
  status: WorkflowStatus;
  currentTask?: string;
  data: Record<string, any>;
  error?: Error;
}
