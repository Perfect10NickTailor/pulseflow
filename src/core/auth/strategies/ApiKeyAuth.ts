import { AuthStrategy, AuthConfig, AuthResponse } from '../AuthInterface';

export class ApiKeyAuth implements AuthStrategy {
  async authenticate(config: AuthConfig): Promise<AuthResponse> {
    const { apiKey, headerName = 'X-API-Key' } = config.credentials;
    
    if (!apiKey) {
      throw new Error('API key is required');
    }

    return {
      headers: {
        [headerName]: apiKey
      }
    };
  }
}
