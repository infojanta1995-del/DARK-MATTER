import { StorageProvider } from '../types';

export class LocalStorageProvider implements StorageProvider {
  private prefix: string;

  constructor(prefix: string = 'dm_os_') {
    this.prefix = prefix;
  }

  private getKey(collection: string, id: string): string {
    return `${this.prefix}${collection}_${id}`;
  }

  private getCollectionPrefix(collection: string): string {
    return `${this.prefix}${collection}_`;
  }

  async create<T>(collection: string, id: string, data: T): Promise<T> {
    try {
      const key = this.getKey(collection, id);
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return data;
    } catch (err) {
      console.warn(`[StorageProvider] Failed to create item ${id} in ${collection}:`, err);
      throw err;
    }
  }

  async read<T>(collection: string, id: string): Promise<T | null> {
    try {
      const key = this.getKey(collection, id);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[StorageProvider] Failed to read item ${id} in ${collection}:`, err);
      return null;
    }
  }

  async update<T>(collection: string, id: string, partialData: Partial<T>): Promise<T> {
    try {
      const existing = await this.read<T>(collection, id);
      if (!existing) {
        throw new Error(`Item ${id} not found in collection ${collection}`);
      }
      const updated = { ...existing, ...partialData };
      await this.create<T>(collection, id, updated);
      return updated;
    } catch (err) {
      console.warn(`[StorageProvider] Failed to update item ${id} in ${collection}:`, err);
      throw err;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const key = this.getKey(collection, id);
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[StorageProvider] Failed to delete item ${id} in ${collection}:`, err);
      return false;
    }
  }

  async list<T>(collection: string): Promise<T[]> {
    try {
      const items: T[] = [];
      const prefix = this.getCollectionPrefix(collection);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              items.push(JSON.parse(raw) as T);
            } catch {
              // Ignore corrupted records
            }
          }
        }
      }
      return items;
    } catch (err) {
      console.warn(`[StorageProvider] Failed to list items in ${collection}:`, err);
      return [];
    }
  }

  async clear(collection: string): Promise<void> {
    try {
      const prefix = this.getCollectionPrefix(collection);
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (err) {
      console.warn(`[StorageProvider] Failed to clear collection ${collection}:`, err);
    }
  }
}

export const defaultStorage: StorageProvider = new LocalStorageProvider();
