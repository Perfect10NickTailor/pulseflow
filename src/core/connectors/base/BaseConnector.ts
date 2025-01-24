import { APIRequestConfig, APIResponse, RetryConfig } from './types';
import { RateLimiter } from '../utils/RateLimiter';
import { RetryHandler } from '../utils/RetryHandler';
import { mockApiFetch } from '../mocks/mockApiFetch';
import { ApiResponse, ApiResponseSuccess, ApiResponseError } from '../types/api-types';

const fetchImpl = mockApiFetch;

export abstract class BaseConnector {
  protected rateLimiter: RateLimiter;
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;
  protected retryConfig: RetryConfig;

  constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {},
    retryConfig: Partial<RetryConfig> = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.rateLimiter = new RateLimiter();
    this.retryConfig = {
      maxAttempts: retryConfig.maxAttempts || 3,
      delayMs: retryConfig.delayMs || 1000,
      backoffFactor: retryConfig.backoffFactor || 2
    };
  }

  protected async request<T>(config: APIRequestConfig): Promise<APIResponse<T>> {
    const fullUrl = new URL(config.url, this.baseUrl).toString();
    
    if (config.queryParams) {
      const url = new URL(fullUrl);
      Object.entries(config.queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    if (config.rateLimit) {
      await this.rateLimiter.waitForLimit(fullUrl, config.rateLimit);
    }

    const requestConfig = {
      method: config.method,
      headers: Object.assign({}, this.defaultHeaders, config.headers || {})
    };

    if (config.body) {
      requestConfig.headers['Content-Type'] = 'application/json';
      Object.assign(requestConfig, { body: JSON.stringify(config.body) });
    }

    const operation = async (): Promise<APIResponse<T>> => {
      const response = await fetchImpl(fullUrl, requestConfig);
      const rawData = await response.json() as ApiResponse<T>;

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        data: rawData,
        status: response.status,
        headers: responseHeaders,
        raw: response
      };
    };

    return RetryHandler.retry(operation, this.retryConfig);
  }

  protected async get<T>(path: string, config: Partial<APIRequestConfig> = {}): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url: path });
  }

  protected async post<T>(path: string, data: any, config: Partial<APIRequestConfig> = {}): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url: path, body: data });
  }

  protected async put<T>(path: string, data: any, config: Partial<APIRequestConfig> = {}): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url: path, body: data });
  }

  protected async delete<T>(path: string, config: Partial<APIRequestConfig> = {}): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url: path });
  }

  abstract initialize(): Promise<void>;
  abstract validateConfig(): Promise<boolean>;
  abstract testConnection(): Promise<boolean>;
}
