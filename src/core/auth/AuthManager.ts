import { AuthStrategy, AuthConfig, AuthResponse } from './AuthInterface';
import { ApiKeyAuth } from './strategies/ApiKeyAuth';
import { BasicAuth } from './strategies/BasicAuth';
import { OAuth2Auth } from './strategies/OAuth2Auth';

export class AuthManager {
  private strategies: Map<string, AuthStrategy>;

  constructor() {
    this.strategies = new Map();
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies(): void {
    this.strategies.set('apiKey', new ApiKeyAuth());
    this.strategies.set('basic', new BasicAuth());
    this.strategies.set('oauth2', new OAuth2Auth());
  }

  registerStrategy(type: string, strategy: AuthStrategy): void {
    this.strategies.set(type, strategy);
  }

  async authenticate(config: AuthConfig): Promise<AuthResponse> {
    const strategy = this.strategies.get(config.type);
    
    if (!strategy) {
      throw new Error(`Authentication strategy ${config.type} not found`);
    }

    return strategy.authenticate(config);
  }

  async refresh(config: AuthConfig): Promise<AuthResponse> {
    const strategy = this.strategies.get(config.type);
    
    if (!strategy || !strategy.refresh) {
      throw new Error(`Refresh not supported for ${config.type}`);
    }

    return strategy.refresh(config);
  }

  async revoke(config: AuthConfig): Promise<void> {
    const strategy = this.strategies.get(config.type);
    
    if (!strategy || !strategy.revoke) {
      throw new Error(`Revocation not supported for ${config.type}`);
    }

    await strategy.revoke(config);
  }
}
