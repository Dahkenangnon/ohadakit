import { MemoryStorage } from '../../src/storage/MemoryStorage';

describe('MemoryStorage', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  describe('CRUD operations', () => {
    test('set then get returns the value', async () => {
      await storage.set('key1', 'value1');
      const result = await storage.get('key1');
      expect(result).toBe('value1');
    });

    test('set with same key overwrites previous value', async () => {
      await storage.set('key1', 'original');
      await storage.set('key1', 'updated');
      const result = await storage.get('key1');
      expect(result).toBe('updated');
    });

    test('delete removes the entry', async () => {
      await storage.set('key1', 'value1');
      await storage.delete('key1');
      const result = await storage.get('key1');
      expect(result).toBeNull();
    });

    test('clear removes all entries', async () => {
      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');
      await storage.clear();
      const all = await storage.getAll();
      expect(all.size).toBe(0);
    });
  });

  describe('Edge cases', () => {
    test('get for non-existent key returns null', async () => {
      const result = await storage.get('nonexistent');
      expect(result).toBeNull();
    });

    test('delete for non-existent key succeeds silently', async () => {
      await expect(storage.delete('nonexistent')).resolves.toBeUndefined();
    });

    test('set with empty string value is stored and retrievable', async () => {
      await storage.set('empty', '');
      const result = await storage.get('empty');
      expect(result).toBe('');
    });

    test('set with empty string key works', async () => {
      await storage.set('', 'value');
      const result = await storage.get('');
      expect(result).toBe('value');
    });
  });

  describe('Data isolation', () => {
    test('getAll returns a copy — mutating returned Map does not affect storage', async () => {
      await storage.set('key1', 'value1');
      const all = await storage.getAll();
      all.set('key2', 'injected');

      // Original storage should not be affected
      const result = await storage.get('key2');
      expect(result).toBeNull();
    });

    test('two MemoryStorage instances do not share data', async () => {
      const storage2 = new MemoryStorage();

      await storage.set('key1', 'value1');
      const result = await storage2.get('key1');
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    test('returns all stored key-value pairs', async () => {
      await storage.set('a', '1');
      await storage.set('b', '2');
      await storage.set('c', '3');

      const all = await storage.getAll();
      expect(all.size).toBe(3);
      expect(all.get('a')).toBe('1');
      expect(all.get('b')).toBe('2');
      expect(all.get('c')).toBe('3');
    });

    test('returns empty Map when no data', async () => {
      const all = await storage.getAll();
      expect(all.size).toBe(0);
      expect(all).toBeInstanceOf(Map);
    });
  });
});
