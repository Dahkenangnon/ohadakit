import { CustomAccountIndex } from '../../src/custom/CustomAccountIndex';
import type { CustomAccountData } from '../../src/custom/types';

function makeCustomAccount(overrides: Partial<CustomAccountData> = {}): CustomAccountData {
  return {
    code: '411A',
    name: 'Clients VIP',
    level: 4,
    classCode: '4',
    parentCode: '411',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isCustom: true,
    ...overrides,
  };
}

describe('CustomAccountIndex', () => {
  let index: CustomAccountIndex;

  beforeEach(() => {
    index = new CustomAccountIndex();
  });

  describe('Index consistency after mutations', () => {
    test('add makes account visible in all indexes', () => {
      const account = makeCustomAccount();
      index.add(account);

      expect(index.get('411A')).toBe(account);
      expect(index.has('411A')).toBe(true);
      expect(index.getByClass('4').some(a => a.code === '411A')).toBe(true);
      expect(index.getByParent('411').some(a => a.code === '411A')).toBe(true);
      expect(index.size).toBe(1);
    });

    test('remove makes account disappear from ALL indexes', () => {
      const account = makeCustomAccount();
      index.add(account);
      const removed = index.remove('411A');

      expect(removed).toBe(true);
      expect(index.get('411A')).toBeNull();
      expect(index.has('411A')).toBe(false);
      expect(index.getByClass('4')).toEqual([]);
      expect(index.getByParent('411')).toEqual([]);
      expect(index.size).toBe(0);
    });

    test('remove of last account in a class cleans up class key', () => {
      const account = makeCustomAccount({ classCode: '7' });
      index.add(account);
      index.remove(account.code);

      expect(index.getByClass('7')).toEqual([]);
    });

    test('update with changed classCode moves between class indexes', () => {
      const original = makeCustomAccount({ classCode: '4' });
      index.add(original);

      const updated = { ...original, classCode: '5', updatedAt: '2024-02-01T00:00:00.000Z' };
      index.update(updated);

      expect(index.getByClass('4')).toEqual([]);
      expect(index.getByClass('5').some(a => a.code === '411A')).toBe(true);
    });

    test('size tracks additions and removals', () => {
      expect(index.size).toBe(0);
      index.add(makeCustomAccount({ code: 'A' }));
      expect(index.size).toBe(1);
      index.add(makeCustomAccount({ code: 'B' }));
      expect(index.size).toBe(2);
      index.remove('A');
      expect(index.size).toBe(1);
    });
  });

  describe('Rebuild', () => {
    test('rebuild replaces all data', () => {
      index.add(makeCustomAccount({ code: 'OLD1' }));
      index.add(makeCustomAccount({ code: 'OLD2' }));

      const newAccount = makeCustomAccount({ code: 'NEW1' });
      index.rebuild([newAccount]);

      expect(index.size).toBe(1);
      expect(index.has('OLD1')).toBe(false);
      expect(index.has('OLD2')).toBe(false);
      expect(index.has('NEW1')).toBe(true);
    });

    test('getStats counts match actual data after rebuild', () => {
      index.rebuild([
        makeCustomAccount({ code: '411A', classCode: '4' }),
        makeCustomAccount({ code: '411B', classCode: '4' }),
        makeCustomAccount({ code: '511A', classCode: '5' }),
      ]);

      const stats = index.getStats();
      expect(stats.total).toBe(3);
      expect(stats.byClass['4']).toBe(2);
      expect(stats.byClass['5']).toBe(1);
    });
  });

  describe('Search', () => {
    test('searchByName is case-insensitive', () => {
      index.add(makeCustomAccount({ code: '411-VIP', name: 'Clients VIP' }));
      const results = index.searchByName('vip');
      expect(results.length).toBe(1);
      expect(results[0]!.code).toBe('411-VIP');
    });

    test('searchByPrefix finds matching codes', () => {
      index.add(makeCustomAccount({ code: '411A' }));
      index.add(makeCustomAccount({ code: '411B' }));
      index.add(makeCustomAccount({ code: '412X' }));

      const results = index.searchByPrefix('411');
      expect(results.length).toBe(2);
      expect(results.every(a => a.code.startsWith('411'))).toBe(true);
    });

    test('searchByPrefix does not match non-prefixed codes', () => {
      index.add(makeCustomAccount({ code: '412X' }));
      const results = index.searchByPrefix('411');
      expect(results.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    test('remove non-existent code returns false', () => {
      expect(index.remove('NONEXISTENT')).toBe(false);
    });

    test('get non-existent code returns null', () => {
      expect(index.get('NONEXISTENT')).toBeNull();
    });

    test('toMap returns a copy', () => {
      const account = makeCustomAccount();
      index.add(account);

      const map = index.toMap();
      map.delete('411A');

      // Original index should not be affected
      expect(index.has('411A')).toBe(true);
    });

    test('getAll returns all accounts', () => {
      index.add(makeCustomAccount({ code: 'A' }));
      index.add(makeCustomAccount({ code: 'B' }));

      const all = index.getAll();
      expect(all.length).toBe(2);
    });

    test('getAllCodes returns all codes', () => {
      index.add(makeCustomAccount({ code: 'A' }));
      index.add(makeCustomAccount({ code: 'B' }));

      const codes = index.getAllCodes();
      expect(codes).toContain('A');
      expect(codes).toContain('B');
    });

    test('getChildrenCodes returns parent children', () => {
      index.add(makeCustomAccount({ code: '411A', parentCode: '411' }));
      index.add(makeCustomAccount({ code: '411B', parentCode: '411' }));
      index.add(makeCustomAccount({ code: '412X', parentCode: '412' }));

      const children = index.getChildrenCodes('411');
      expect(children).toContain('411A');
      expect(children).toContain('411B');
      expect(children).not.toContain('412X');
    });

    test('clear empties everything', () => {
      index.add(makeCustomAccount({ code: 'A' }));
      index.add(makeCustomAccount({ code: 'B' }));
      index.clear();

      expect(index.size).toBe(0);
      expect(index.getAll()).toEqual([]);
    });
  });
});
