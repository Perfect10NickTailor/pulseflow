import { BaseTrigger } from './BaseTrigger';
import { TriggerContext, TriggerResult } from './types';
import cron from 'node-cron';

export class ScheduleTrigger extends BaseTrigger {
  type = 'schedule';

  async validate(config: Record<string, any>): Promise<boolean> {
    const { schedule } = config;
    return Boolean(schedule && cron.validate(schedule));
  }

  async execute(context: TriggerContext): Promise<TriggerResult> {
    const { schedule } = context.payload;
    
    if (!schedule || !cron.validate(schedule)) {
      return this.createResult(false, undefined, new Error('Invalid schedule format'));
    }

    return this.createResult(true, { scheduledTime: new Date().toISOString() });
  }
}
