export class RateLimiter {
  private limits: Map<string, number>;

  constructor() {
    this.limits = new Map();
  }

  async waitForLimit(key: string, config: { maxRequests: number; timeWindow: number }): Promise<void> {
    const now = Date.now();
    const currentRequests = this.limits.get(key) || 0;

    if (currentRequests >= config.maxRequests) {
      const delay = config.timeWindow;
      await new Promise(resolve => setTimeout(resolve, delay));
      this.limits.set(key, 1);
    } else {
      this.limits.set(key, currentRequests + 1);
    }
  }
}
