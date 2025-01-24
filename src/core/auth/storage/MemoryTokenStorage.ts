import { TokenStorage, OAuth2Token } from '../types/OAuth2Types';

export class MemoryTokenStorage implements TokenStorage {
  private tokens: Map<string, OAuth2Token>;

  constructor() {
    this.tokens = new Map();
  }

  async get(key: string): Promise<OAuth2Token | null> {
    return this.tokens.get(key) || null;
  }

  async save(key: string, token: OAuth2Token): Promise<void> {
    this.tokens.set(key, token);
  }

  async delete(key: string): Promise<void> {
    this.tokens.delete(key);
  }
}
