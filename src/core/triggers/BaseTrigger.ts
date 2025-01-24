import { TriggerHandler, TriggerContext, TriggerResult } from './types';

export abstract class BaseTrigger implements TriggerHandler {
  abstract type: string;
  
  abstract validate(config: Record<string, any>): Promise<boolean>;
  abstract execute(context: TriggerContext): Promise<TriggerResult>;
  
  protected createResult(
    shouldExecute: boolean,
    data?: Record<string, any>,
    error?: Error
  ): TriggerResult {
    return {
      shouldExecute,
      data,
      error
    };
  }
}
