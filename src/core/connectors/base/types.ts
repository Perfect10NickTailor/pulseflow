import { ApiResponse } from '../types/api-types';

export interface APIRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: any;
  retryAttempts?: number;
  rateLimit?: {
    maxRequests: number;
    timeWindow: number;
  };
}

export interface APIResponse<T> {
  data: ApiResponse<T>;
  status: number;
  headers: Record<string, string>;
  raw?: any;
}

export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
}
