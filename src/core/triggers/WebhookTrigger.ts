import { BaseTrigger } from './BaseTrigger';
import { TriggerContext, TriggerResult } from './types';

export class WebhookTrigger extends BaseTrigger {
  type = 'webhook';

  async validate(config: Record<string, any>): Promise<boolean> {
    const { path, method = 'POST' } = config;
    return Boolean(path && typeof path === 'string' && 
      ['GET', 'POST', 'PUT', 'DELETE'].includes(method));
  }

  async execute(context: TriggerContext): Promise<TriggerResult> {
    const { payload } = context;
    
    if (!payload) {
      return this.createResult(false, undefined, new Error('No webhook payload'));
    }

    return this.createResult(true, { webhookData: payload });
  }
}
