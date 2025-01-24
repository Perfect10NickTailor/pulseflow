import { HealthCheckResponse } from '../types/api-types';

export const mockApiFetch = async (url: string, options: any) => {
  console.log('Mock API Call to:', url);
  
  // Mock health endpoint response
  if (url.includes('/health')) {
    const healthResponse: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Map([
        ['content-type', 'application/json']
      ]),
      json: async () => ({
        success: true,
        data: healthResponse
      })
    };
  }

  // Mock data endpoint response
  if (url.includes('/data')) {
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Map([
        ['content-type', 'application/json']
      ]),
      json: async () => ({
        success: true,
        data: {
          items: [
            { id: 1, name: 'Test Item 1' },
            { id: 2, name: 'Test Item 2' }
          ],
          totalItems: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      })
    };
  }

  // Default error response
  return {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    headers: new Map([
      ['content-type', 'application/json']
    ]),
    json: async () => ({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found'
      }
    })
  };
};
