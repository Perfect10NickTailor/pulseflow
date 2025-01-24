import { AuthStrategy, AuthConfig, AuthResponse } from '../AuthInterface';

export class BasicAuth implements AuthStrategy {
  async authenticate(config: AuthConfig): Promise<AuthResponse> {
    const { username, password } = config.credentials;
    
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const token = Buffer.from(`${username}:${password}`).toString('base64');
    
    return {
      headers: {
        'Authorization': `Basic ${token}`
      }
    };
  }
}
