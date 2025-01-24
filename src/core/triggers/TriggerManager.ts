import { TriggerHandler, TriggerConfig, TriggerContext, TriggerResult } from './types';
import { ScheduleTrigger } from './ScheduleTrigger';
import { WebhookTrigger } from './WebhookTrigger';

export class TriggerManager {
  private triggers: Map<string, TriggerHandler>;
  private activeConfigs: Map<string, TriggerConfig[]>;

  constructor() {
    this.triggers = new Map();
    this.activeConfigs = new Map();
    this.registerDefaultTriggers();
  }

  private registerDefaultTriggers(): void {
    this.registerTrigger(new ScheduleTrigger());
    this.registerTrigger(new WebhookTrigger());
  }

  registerTrigger(trigger: TriggerHandler): void {
    this.triggers.set(trigger.type, trigger);
  }

  async addTrigger(config: TriggerConfig): Promise<void> {
    const trigger = this.triggers.get(config.type);
    if (!trigger) {
      throw new Error(`Unknown trigger type: ${config.type}`);
    }

    const isValid = await trigger.validate(config.config);
    if (!isValid) {
      throw new Error(`Invalid trigger configuration for type: ${config.type}`);
    }

    const workflowTriggers = this.activeConfigs.get(config.workflowId) || [];
    workflowTriggers.push(config);
    this.activeConfigs.set(config.workflowId, workflowTriggers);
  }

  async processTrigger(context: TriggerContext): Promise<TriggerResult> {
    const trigger = this.triggers.get(context.triggerType);
    if (!trigger) {
      return { shouldExecute: false, error: new Error(`Unknown trigger type: ${context.triggerType}`) };
    }

    return trigger.execute(context);
  }

  getTriggerConfigs(workflowId: string): TriggerConfig[] {
    return this.activeConfigs.get(workflowId) || [];
  }
}
