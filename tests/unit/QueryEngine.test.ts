import { QueryBuilder } from '../../src/query/QueryEngine';
import { AccountRegistry, getDefaultRegistry, resetDefaultRegistry } from '../../src/core/AccountRegistry';

describe('QueryEngine', () => {
  let registry: AccountRegistry;

  beforeAll(() => {
    resetDefaultRegistry();
    registry = getDefaultRegistry();
  });

  describe('Filter combinations', () => {
    test('inClass + atLevel → every result matches both', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .atLevel(3)
        .execute();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.classCode).toBe('4');
        expect(acc.level).toBe(3);
      });
    });

    test('inClass with array + nameContains → results from both classes', () => {
      const results = new QueryBuilder(registry)
        .inClass(['4', '5'])
        .execute();

      expect(results.length).toBeGreaterThan(0);
      const classes = new Set(results.map(acc => acc.classCode));
      expect(classes.has('4')).toBe(true);
      expect(classes.has('5')).toBe(true);
      expect(classes.size).toBe(2);
    });

    test('inClass + where(isLeaf) → only leaf accounts in that class', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .where(acc => acc.isLeaf)
        .execute();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.classCode).toBe('4');
        expect(acc.isLeaf).toBe(true);
      });
    });

    test('withParent filter', () => {
      const results = new QueryBuilder(registry)
        .withParent('41')
        .execute();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.parentCode).toBe('41');
      });
    });

    test('codeMatches with regex', () => {
      const results = new QueryBuilder(registry)
        .codeMatches(/^41\d{2}$/)
        .execute();

      results.forEach(acc => {
        expect(acc.code).toMatch(/^41\d{2}$/);
      });
    });
  });

  describe('Pagination', () => {
    test('offset + limit returns correct slice', () => {
      const all = new QueryBuilder(registry)
        .inClass('4')
        .sortBy('code', 'asc')
        .execute();

      const paginated = new QueryBuilder(registry)
        .inClass('4')
        .sortBy('code', 'asc')
        .offset(10)
        .limit(5)
        .execute();

      expect(paginated.length).toBeLessThanOrEqual(5);
      if (all.length > 14) {
        expect(paginated[0]!.code).toBe(all[10]!.code);
      }
    });

    test('offset beyond total → empty results', () => {
      const total = new QueryBuilder(registry).inClass('4').count();
      const results = new QueryBuilder(registry)
        .inClass('4')
        .offset(total + 100)
        .execute();

      expect(results.length).toBe(0);
    });

    test('limit(0) → empty results', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .limit(0)
        .execute();

      expect(results.length).toBe(0);
    });
  });

  describe('where() predicate chaining', () => {
    test('two where() calls combine with AND', () => {
      const results = new QueryBuilder(registry)
        .where(a => a.level >= 3)
        .where(a => a.isLeaf)
        .execute();

      results.forEach(acc => {
        expect(acc.level).toBeGreaterThanOrEqual(3);
        expect(acc.isLeaf).toBe(true);
      });
    });

    test('both predicates are evaluated (not just the last one)', () => {
      // First predicate: class 4 only
      // Second predicate: level 2 only, code exactly '41'
      const results = new QueryBuilder(registry)
        .where(a => a.classCode === '4')
        .where(a => a.code === '41')
        .execute();

      expect(results.length).toBe(1);
      expect(results[0]!.code).toBe('41');
    });
  });

  describe('Sorting', () => {
    test('sortBy code asc → ascending lexicographic order', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .sortBy('code', 'asc')
        .execute();

      for (let i = 1; i < results.length; i++) {
        expect(results[i]!.code >= results[i - 1]!.code).toBe(true);
      }
    });

    test('sortBy code desc → descending order', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .sortBy('code', 'desc')
        .execute();

      for (let i = 1; i < results.length; i++) {
        expect(results[i]!.code <= results[i - 1]!.code).toBe(true);
      }
    });

    test('sortBy level asc → level 1 before level 2', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .sortBy('level', 'asc')
        .execute();

      for (let i = 1; i < results.length; i++) {
        expect(results[i]!.level >= results[i - 1]!.level).toBe(true);
      }
    });

    test('sortBy name asc → alphabetical', () => {
      const results = new QueryBuilder(registry)
        .inClass('4')
        .sortBy('name', 'asc')
        .execute();

      for (let i = 1; i < results.length; i++) {
        expect(results[i]!.name.localeCompare(results[i - 1]!.name)).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Convenience methods', () => {
    test('first() returns same as execute()[0]', () => {
      const first = new QueryBuilder(registry).inClass('4').sortBy('code', 'asc').first();
      const all = new QueryBuilder(registry).inClass('4').sortBy('code', 'asc').execute();
      expect(first?.code).toBe(all[0]?.code);
    });

    test('exists() returns true when results exist', () => {
      expect(new QueryBuilder(registry).inClass('4').exists()).toBe(true);
    });

    test('exists() returns false for impossible filter', () => {
      expect(new QueryBuilder(registry).codeMatches(/^0/).exists()).toBe(false);
    });

    test('count() matches execute().length', () => {
      const count = new QueryBuilder(registry).inClass('4').count();
      const length = new QueryBuilder(registry).inClass('4').execute().length;
      expect(count).toBe(length);
    });

    test('first() returns null when no results', () => {
      const first = new QueryBuilder(registry).codeMatches(/^0/).first();
      expect(first).toBeNull();
    });
  });

  describe('Fuzzy search integration', () => {
    test('search with fuzzy finds accounts despite typo', () => {
      const results = new QueryBuilder(registry)
        .search('cliens', { fuzzy: true, threshold: 0.6 })
        .execute();

      const names = results.map(acc => acc.name.toLowerCase());
      expect(names.some(n => n.includes('client'))).toBe(true);
    });

    test('search without fuzzy uses exact name matching', () => {
      const results = new QueryBuilder(registry)
        .search('Clients')
        .execute();

      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('nameContains filter', () => {
    test('case-insensitive name search', () => {
      const results = new QueryBuilder(registry)
        .nameContains('CLIENT')
        .execute();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.name.toLowerCase()).toContain('client');
      });
    });
  });
});
