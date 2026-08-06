export class AICacheService {
  private static cache = new Map<string, { data: any; expiresAt: number }>();

  static get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  static set(key: string, data: any, ttlSeconds: number = 3600) {
    this.cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}
