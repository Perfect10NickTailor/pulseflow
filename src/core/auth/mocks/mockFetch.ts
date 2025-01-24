export const mockFetch = async (url: string, options: any) => {
  // Mock token endpoint response
  if (url.includes('/oauth/token')) {
    return {
      ok: true,
      json: async () => ({
        access_token: 'mock-access-token-123',
        refresh_token: 'mock-refresh-token-456',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read write'
      })
    };
  }

  // Default response for unknown endpoints
  return {
    ok: false,
    statusText: 'Not Found'
  };
};
