import { BaseConnector } from './base/BaseConnector';
import { ApiResponse, HealthCheckResponse } from './types/api-types';

interface ExampleAPIConfig {
  apiKey: string;
  baseUrl: string;
}

interface DataItem {
  id: number;
  name: string;
}

interface DataResponse {
  items: DataItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ExampleConnector extends BaseConnector {
  private config: ExampleAPIConfig;

  constructor(config: ExampleAPIConfig) {
    super(config.baseUrl, {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    });
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('Initializing connector with config:', {
      baseUrl: this.config.baseUrl,
      apiKeyPresent: !!this.config.apiKey
    });
    const isValid = await this.validateConfig();
    if (!isValid) {
      throw new Error('Invalid configuration');
    }
  }

  async validateConfig(): Promise<boolean> {
    return Boolean(this.config.apiKey && this.config.baseUrl);
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.get<HealthCheckResponse>('/health');
      return response.status === 200 && response.data.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getData(): Promise<DataResponse> {
    const response = await this.get<DataResponse>('/data');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  }
}
