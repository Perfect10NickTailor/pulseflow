export interface TriggerContext {
  workflowId: string;
  triggerType: string;
  timestamp: number;
  payload: any;
}

export interface TriggerResult {
  shouldExecute: boolean;
  data?: Record<string, any>;
  error?: Error;
}

export interface TriggerConfig {
  type: string;
  config: Record<string, any>;
  workflowId: string;
}

export interface TriggerHandler {
  type: string;
  validate(config: Record<string, any>): Promise<boolean>;
  execute(context: TriggerContext): Promise<TriggerResult>;
}
