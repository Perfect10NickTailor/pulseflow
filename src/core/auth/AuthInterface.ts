export interface AuthConfig {
  type: string;
  credentials: Record<string, any>;
}

export interface AuthResponse {
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  token?: string;
  authUrl?: string;  // Added this property
}

export interface AuthStrategy {
  authenticate(config: AuthConfig): Promise<AuthResponse>;
  refresh?(config: AuthConfig): Promise<AuthResponse>;
  revoke?(config: AuthConfig): Promise<void>;
}
