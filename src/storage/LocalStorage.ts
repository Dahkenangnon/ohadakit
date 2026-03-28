/**
 * Browser localStorage adapter (persists data in browser)
 */

import type { StorageAdapter } from '../core/types';
import { StorageError } from '../validation/errors';

/**
 * Browser localStorage implementation
 * Data persists across browser sessions
 * Only works in browser environments
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;
  private storage: Storage;

  constructor(prefix: string = 'ohadakit:') {
    this.prefix = prefix;

    // Check if localStorage is available
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      throw new StorageError(
        'init',
        'localStorage is not available (not in browser environment)'
      );
    }

    this.storage = window.localStorage;
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private removePrefixFromKey(prefixedKey: string): string {
    return prefixedKey.startsWith(this.prefix)
      ? prefixedKey.slice(this.prefix.length)
      : prefixedKey;
  }

  async get(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      return this.storage.getItem(prefixedKey);
    } catch (error) {
      throw new StorageError(
        'get',
        `Failed to get key "${key}" from localStorage`,
        error as Error
      );
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      this.storage.setItem(prefixedKey, value);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError(
          'set',
          `localStorage quota exceeded when setting key "${key}"`,
          error
        );
      }
      throw new StorageError(
        'set',
        `Failed to set key "${key}" in localStorage`,
        error as Error
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      this.storage.removeItem(prefixedKey);
    } catch (error) {
      throw new StorageError(
        'delete',
        `Failed to delete key "${key}" from localStorage`,
        error as Error
      );
    }
  }

  async getAll(): Promise<Map<string, string>> {
    try {
      const result = new Map<string, string>();

      for (let i = 0; i < this.storage.length; i++) {
        const prefixedKey = this.storage.key(i);
        if (prefixedKey && prefixedKey.startsWith(this.prefix)) {
          const key = this.removePrefixFromKey(prefixedKey);
          const value = this.storage.getItem(prefixedKey);
          if (value !== null) {
            result.set(key, value);
          }
        }
      }

      return result;
    } catch (error) {
      throw new StorageError(
        'getAll',
        'Failed to get all entries from localStorage',
        error as Error
      );
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToDelete: string[] = [];

      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.storage.removeItem(key));
    } catch (error) {
      throw new StorageError(
        'clear',
        'Failed to clear localStorage',
        error as Error
      );
    }
  }
}
