import { RetryConfig } from '../base/types';

export class RetryHandler {
  static async retry<T>(
    operation: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    let attempt = 0;

    while (attempt < config.maxAttempts) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;

        if (attempt === config.maxAttempts) {
          throw new Error(`Operation failed after ${config.maxAttempts} attempts. Last error: ${error.message}`);
        }

        const delay = config.delayMs * Math.pow(config.backoffFactor, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Operation failed after ${config.maxAttempts} attempts`);
  }
}
