export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope?: string[];
  state?: string;
}

export interface OAuth2Token {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
  scope?: string[];
  createdAt: number;
}

export interface TokenStorage {
  get(key: string): Promise<OAuth2Token | null>;
  save(key: string, token: OAuth2Token): Promise<void>;
  delete(key: string): Promise<void>;
}
