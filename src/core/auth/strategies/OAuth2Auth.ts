import { AuthStrategy, AuthConfig, AuthResponse } from '../AuthInterface';
import { OAuth2Config, OAuth2Token, TokenStorage } from '../types/OAuth2Types';
import { MemoryTokenStorage } from '../storage/MemoryTokenStorage';
import { mockFetch } from '../mocks/mockFetch';

// Use mock fetch in development, real fetch in production
const fetchImpl = process.env.NODE_ENV === 'production' ? require('node-fetch').default : mockFetch;

export class OAuth2Auth implements AuthStrategy {
  private tokenStorage: TokenStorage;

  constructor(storage?: TokenStorage) {
    this.tokenStorage = storage || new MemoryTokenStorage();
  }

  private async fetchToken(tokenUrl: string, params: Record<string, string>): Promise<OAuth2Token> {
    try {
      const response = await fetchImpl(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params).toString()
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        scope: data.scope?.split(' '),
        createdAt: Date.now()
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch token: ${error.message}`);
    }
  }

  private isTokenExpired(token: OAuth2Token): boolean {
    if (!token.expiresIn) return false;
    const expiresAt = token.createdAt + (token.expiresIn * 1000);
    return Date.now() >= expiresAt;
  }

  async authenticate(config: AuthConfig): Promise<AuthResponse> {
    const oauth2Config = config.credentials as OAuth2Config;
    const storageKey = `oauth2_${oauth2Config.clientId}`;

    // Check for existing valid token
    const existingToken = await this.tokenStorage.get(storageKey);
    if (existingToken && !this.isTokenExpired(existingToken)) {
      return {
        headers: {
          'Authorization': `${existingToken.tokenType} ${existingToken.accessToken}`
        }
      };
    }

    // If we have a refresh token, try to use it
    if (existingToken?.refreshToken) {
      try {
        return await this.refresh(config);
      } catch (error) {
        console.warn('Token refresh failed, proceeding with new token request');
      }
    }

    // Handle initial OAuth flow
    if (!config.credentials.code) {
      // Generate authorization URL
      const params = new URLSearchParams({
        client_id: oauth2Config.clientId,
        redirect_uri: oauth2Config.redirectUri,
        response_type: 'code',
        scope: oauth2Config.scope?.join(' ') || '',
        state: oauth2Config.state || Math.random().toString(36).substring(7)
      });

      return {
        authUrl: `${oauth2Config.authorizationUrl}?${params.toString()}`
      };
    }

    // Exchange authorization code for token
    const token = await this.fetchToken(oauth2Config.tokenUrl, {
      grant_type: 'authorization_code',
      code: config.credentials.code,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
      redirect_uri: oauth2Config.redirectUri
    });

    await this.tokenStorage.save(storageKey, token);

    return {
      headers: {
        'Authorization': `${token.tokenType} ${token.accessToken}`
      }
    };
  }

  async refresh(config: AuthConfig): Promise<AuthResponse> {
    const oauth2Config = config.credentials as OAuth2Config;
    const storageKey = `oauth2_${oauth2Config.clientId}`;
    
    const existingToken = await this.tokenStorage.get(storageKey);
    if (!existingToken?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const token = await this.fetchToken(oauth2Config.tokenUrl, {
      grant_type: 'refresh_token',
      refresh_token: existingToken.refreshToken,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret
    });

    await this.tokenStorage.save(storageKey, token);

    return {
      headers: {
        'Authorization': `${token.tokenType} ${token.accessToken}`
      }
    };
  }

  async revoke(config: AuthConfig): Promise<void> {
    const oauth2Config = config.credentials as OAuth2Config;
    const storageKey = `oauth2_${oauth2Config.clientId}`;
    await this.tokenStorage.delete(storageKey);
  }
}
