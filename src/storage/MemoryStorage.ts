/**
 * In-memory storage adapter (data is lost when application restarts)
 */

import type { StorageAdapter } from '../core/types';
import { StorageError } from '../validation/errors';

/**
 * In-memory storage implementation
 * Data is stored in a Map and lost when the application restarts
 */
export class MemoryStorage implements StorageAdapter {
  private storage: Map<string, string>;

  constructor() {
    this.storage = new Map();
  }

  async get(key: string): Promise<string | null> {
    try {
      return this.storage.get(key) ?? null;
    } catch (error) {
      throw new StorageError(
        'get',
        `Failed to get key "${key}"`,
        error as Error
      );
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      this.storage.set(key, value);
    } catch (error) {
      throw new StorageError(
        'set',
        `Failed to set key "${key}"`,
        error as Error
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.storage.delete(key);
    } catch (error) {
      throw new StorageError(
        'delete',
        `Failed to delete key "${key}"`,
        error as Error
      );
    }
  }

  async getAll(): Promise<Map<string, string>> {
    try {
      return new Map(this.storage);
    } catch (error) {
      throw new StorageError(
        'getAll',
        'Failed to get all entries',
        error as Error
      );
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      throw new StorageError('clear', 'Failed to clear storage', error as Error);
    }
  }
}
