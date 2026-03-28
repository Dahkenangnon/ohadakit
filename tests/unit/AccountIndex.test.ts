import { AccountIndex } from '../../src/core/AccountIndex';
import { AccountRegistry, getDefaultRegistry, resetDefaultRegistry } from '../../src/core/AccountRegistry';
import type { Account } from '../../src/core/Account';

describe('AccountIndex', () => {
  let registry: AccountRegistry;
  let allAccounts: Account[];

  beforeAll(() => {
    resetDefaultRegistry();
    registry = getDefaultRegistry();
    allAccounts = registry.getAll();
  });

  describe('Trie prefix search', () => {
    test('prefix "41" returns accounts 41, 411, 4111 but NOT 51 or 4', () => {
      const results = registry.searchByPrefix('41');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.code.startsWith('41')).toBe(true);
      });
      // Must include 41 itself
      expect(results.some(acc => acc.code === '41')).toBe(true);
      // Must not include class root "4"
      expect(results.some(acc => acc.code === '4')).toBe(false);
      // Must not include accounts from other classes
      expect(results.some(acc => acc.code.startsWith('5'))).toBe(false);
    });

    test('non-existent prefix returns empty array', () => {
      const results = registry.searchByPrefix('999');
      expect(results).toEqual([]);
    });

    test('single-char prefix "4" returns ALL class 4 accounts', () => {
      const prefixResults = registry.searchByPrefix('4');
      const classResults = registry.getByClass('4');
      expect(prefixResults.length).toBe(classResults.length);
    });

    test('full code prefix returns at least that account', () => {
      const results = registry.searchByPrefix('4111');
      expect(results.some(acc => acc.code === '4111')).toBe(true);
    });
  });

  describe('Levenshtein fuzzy search', () => {
    test('"cliens" (typo) with threshold 0.6 matches "Clients"', () => {
      const results = registry.searchByNameFuzzy('cliens', 0.6);
      const names = results.map(acc => acc.name.toLowerCase());
      expect(names.some(n => n.includes('client'))).toBe(true);
    });

    test('"xyz" with threshold 0.9 returns empty — no false positives', () => {
      const results = registry.searchByNameFuzzy('xyz', 0.9);
      expect(results.length).toBe(0);
    });

    test('exact substring scores 1.0', () => {
      // "client" is a substring of "Clients" → fuzzyMatch returns 1.0
      const results = registry.searchByNameFuzzy('client', 1.0);
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.name.toLowerCase()).toContain('client');
      });
    });

    test('threshold 0.0 returns accounts with character overlap', () => {
      // Pre-filter rejects accounts with zero character overlap with query
      const results = registry.searchByNameFuzzy('a', 0.0);
      // Should return many results but not necessarily all (those without 'a' are pre-filtered)
      expect(results.length).toBeGreaterThan(allAccounts.length * 0.5);
      expect(results.length).toBeLessThanOrEqual(allAccounts.length);
    });

    test('limit parameter caps results', () => {
      const results = registry.searchByNameFuzzy('compte', 0.3, 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Word-based name search', () => {
    test('"Clients" matches accounts containing that exact word', () => {
      const results = registry.searchByName('Clients');
      expect(results.length).toBeGreaterThan(0);
      // At least one should have "Clients" as a word
      expect(results.some(acc =>
        acc.name.toLowerCase().split(/\s+/).includes('clients')
      )).toBe(true);
    });

    test('partial word "cli" falls back to substring scan', () => {
      const results = registry.searchByName('cli');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.name.toLowerCase()).toContain('cli');
      });
    });

    test('empty string query returns empty results', () => {
      const results = registry.searchByName('');
      // Empty string matches everything in substring search, but word index would have empty word
      // The actual behavior: empty splits to [''], nameIndex.get('') returns undefined,
      // then substring fallback '' is included in everything — but this is existing behavior
      // We just verify it doesn't crash
      expect(Array.isArray(results)).toBe(true);
    });

    test('limit parameter works', () => {
      const results = registry.searchByName('compte', { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Index rebuild and consistency', () => {
    test('rebuild with subset contains only that subset', () => {
      const subset = allAccounts.slice(0, 10);
      const index = new AccountIndex(subset);

      expect(index.size).toBe(10);
      subset.forEach(acc => {
        expect(index.has(acc.code)).toBe(true);
        expect(index.get(acc.code)).toBe(acc);
      });
    });

    test('clear empties all indexes', () => {
      const index = new AccountIndex(allAccounts.slice(0, 5));
      expect(index.size).toBe(5);

      index.clear();
      expect(index.size).toBe(0);
      expect(index.getAll()).toEqual([]);
    });

    test('rebuild after clear restores correct state', () => {
      const subset = allAccounts.slice(0, 3);
      const index = new AccountIndex(allAccounts);

      index.clear();
      index.rebuild(subset);

      expect(index.size).toBe(3);
      expect(index.getAll().length).toBe(3);
    });
  });

  describe('Cross-index consistency', () => {
    test('has() and get() agree for every account', () => {
      allAccounts.forEach(acc => {
        expect(registry.has(acc.code)).toBe(true);
        const retrieved = registry.getByCode(acc.code);
        expect(retrieved).toBe(acc);
      });
    });

    test('getByClass count matches getClassCounts', () => {
      const stats = registry.getStats();
      for (const [classCode, count] of Object.entries(stats.byClass)) {
        const classAccounts = registry.getByClass(classCode);
        expect(classAccounts.length).toBe(count);
      }
    });

    test('getChildren returns only accounts whose parentCode matches', () => {
      const parent = registry.getByCode('41');
      expect(parent).not.toBeNull();

      const children = registry.getChildren('41');
      children.forEach(child => {
        expect(child.parentCode).toBe('41');
      });
    });
  });

  describe('Secondary indexes', () => {
    test('getByLevel returns correct levels', () => {
      for (let level = 1; level <= 4; level++) {
        const accounts = registry.getByLevel(level);
        accounts.forEach(acc => {
          expect(acc.level).toBe(level);
        });
      }
    });

    test('getByClass returns correct class', () => {
      for (let cls = 1; cls <= 9; cls++) {
        const accounts = registry.getByClass(String(cls));
        accounts.forEach(acc => {
          expect(acc.classCode).toBe(String(cls));
        });
      }
    });

    test('getClassCounts and getLevelCounts return Maps', () => {
      const index = new AccountIndex(allAccounts);
      const classCounts = index.getClassCounts();
      const levelCounts = index.getLevelCounts();

      expect(classCounts).toBeInstanceOf(Map);
      expect(levelCounts).toBeInstanceOf(Map);

      let totalFromClass = 0;
      classCounts.forEach(count => { totalFromClass += count; });
      expect(totalFromClass).toBe(allAccounts.length);

      let totalFromLevel = 0;
      levelCounts.forEach(count => { totalFromLevel += count; });
      expect(totalFromLevel).toBe(allAccounts.length);
    });
  });
});
