import { Account, isAccount } from '../../src/core/Account';
import { AccountRegistry, getDefaultRegistry, resetDefaultRegistry } from '../../src/core/AccountRegistry';

describe('Account', () => {
  let registry: AccountRegistry;

  beforeAll(() => {
    resetDefaultRegistry();
    registry = getDefaultRegistry();
  });

  describe('Lazy caching', () => {
    test('parent returns same reference on repeated access', () => {
      const account = registry.getByCode('4111')!;
      const parent1 = account.parent;
      const parent2 = account.parent;
      expect(parent1).toBe(parent2); // Same object reference
    });

    test('children returns same reference on repeated access', () => {
      const account = registry.getByCode('41')!;
      const children1 = account.children;
      const children2 = account.children;
      expect(children1).toBe(children2);
    });

    test('ancestors ordering is nearest-parent-first', () => {
      const account = registry.getByCode('4111')!;
      const ancestors = account.ancestors;
      // Nearest ancestor (parent) should be first
      expect(ancestors[0]?.code).toBe('411');
      expect(ancestors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Relationship graph', () => {
    test('4111: parent is 411, grandparent is 41', () => {
      const account = registry.getByCode('4111')!;
      expect(account.parent?.code).toBe('411');
      expect(account.parent?.parent?.code).toBe('41');
      // OHADA data has no level-1 class accounts, so 41 is the root
      expect(account.parent?.parent?.parent).toBeNull();
    });

    test('path for 4111 is root-to-self ordering', () => {
      const account = registry.getByCode('4111')!;
      const pathCodes = account.path.map(a => a.code);
      // OHADA hierarchy starts at level 2, no level-1 class account "4"
      expect(pathCodes).toEqual(['41', '411', '4111']);
    });

    test('pathString matches expected format', () => {
      const account = registry.getByCode('4111')!;
      expect(account.pathString).toBe('41 > 411 > 4111');
    });

    test('pathCodes matches path codes', () => {
      const account = registry.getByCode('4111')!;
      expect(account.pathCodes).toEqual(['41', '411', '4111']);
    });

    test('siblings of 411 does NOT include 411 itself', () => {
      const account = registry.getByCode('411')!;
      const siblingCodes = account.siblings.map(s => s.code);
      expect(siblingCodes).not.toContain('411');
      // Should include other children of 41
      if (siblingCodes.length > 0) {
        siblingCodes.forEach(code => {
          const sibling = registry.getByCode(code)!;
          expect(sibling.parentCode).toBe(account.parentCode);
        });
      }
    });
  });

  describe('Boundary accounts', () => {
    test('root account (level 2): parent is null, isRoot is true, ancestors is empty', () => {
      // OHADA data starts at level 2, so "41" is a root account
      const root = registry.getByCode('41')!;
      expect(root.parent).toBeNull();
      expect(root.isRoot).toBe(true);
      expect(root.ancestors).toEqual([]);
      expect(root.depth).toBe(0);
    });

    test('leaf account: children is empty, isLeaf is true', () => {
      const leaf = registry.getAll().find(acc => acc.children.length === 0)!;
      expect(leaf.isLeaf).toBe(true);
      expect(leaf.children).toEqual([]);
    });

    test('classAccount for a level-4 account returns the topmost ancestor', () => {
      const account = registry.getByCode('4111')!;
      const classAcc = account.classAccount;
      // classAccount returns the last (furthest) ancestor — the level-2 root
      expect(classAcc).not.toBeNull();
      expect(classAcc?.code).toBe('41');
    });

    test('classAccount for a root account returns null (no ancestors)', () => {
      const root = registry.getByCode('41')!;
      expect(root.classAccount).toBeNull();
    });
  });

  describe('Relationship predicates', () => {
    test('4111.isDescendantOf("41") is true (transitive)', () => {
      const account = registry.getByCode('4111')!;
      expect(account.isDescendantOf('41')).toBe(true);
    });

    test('4111.isDescendantOf("51") is false (wrong class)', () => {
      const account = registry.getByCode('4111')!;
      expect(account.isDescendantOf('51')).toBe(false);
    });

    test('41.isAncestorOf("4111") is true', () => {
      const root = registry.getByCode('41')!;
      expect(root.isAncestorOf('4111')).toBe(true);
    });

    test('41.isAncestorOf("51") is false', () => {
      const root = registry.getByCode('41')!;
      expect(root.isAncestorOf('51')).toBe(false);
    });

    test('isSiblingOf returns true for actual siblings', () => {
      const account = registry.getByCode('411')!;
      const siblings = account.siblings;
      if (siblings.length > 0) {
        expect(account.isSiblingOf(siblings[0]!.code)).toBe(true);
      }
    });
  });

  describe('getDescendants / getDescendantsAtLevel', () => {
    test('getDescendants for a root returns all accounts in its subtree', () => {
      const root = registry.getByCode('41')!;
      const descendants = root.getDescendants();
      expect(descendants.length).toBeGreaterThan(0);
      // No descendant should be the root itself
      expect(descendants.every(d => d.code !== '41')).toBe(true);
      // All descendants should be in class 4
      descendants.forEach(d => {
        expect(d.classCode).toBe('4');
      });
    });

    test('getDescendantsAtLevel(1) returns only direct children', () => {
      const account = registry.getByCode('41')!;
      const level1 = account.getDescendantsAtLevel(1);
      const children = account.children;
      expect(level1.length).toBe(children.length);
      level1.forEach(d => {
        expect(d.parentCode).toBe('41');
      });
    });

    test('getDescendantsAtLevel(2) returns only grandchildren', () => {
      const account = registry.getByCode('41')!;
      const level2 = account.getDescendantsAtLevel(2);
      level2.forEach(d => {
        expect(d.depth - account.depth).toBe(2);
      });
    });
  });

  describe('Serialization', () => {
    test('fromJSON roundtrip preserves fields', () => {
      const original = registry.getByCode('4111')!;
      const json = original.toJSON();
      const restored = Account.fromJSON(json);

      expect(restored.code).toBe(original.code);
      expect(restored.name).toBe(original.name);
      expect(restored.level).toBe(original.level);
      expect(restored.classCode).toBe(original.classCode);
      expect(restored.parentCode).toBe(original.parentCode);
    });

    test('toRawData strips computed fields', () => {
      const account = registry.getByCode('4111')!;
      const raw = account.toRawData();

      expect(raw.code).toBe(account.code);
      expect(raw.name).toBe(account.name);
      expect(raw.level).toBe(account.level);
      expect(raw.classCode).toBe(account.classCode);
      expect(raw.parentCode).toBe(account.parentCode);
      // Should not have computed fields
      expect('path' in raw).toBe(false);
      expect('pathString' in raw).toBe(false);
      expect('children' in raw).toBe(false);
    });

    test('toJSON includes path data', () => {
      const account = registry.getByCode('4111')!;
      const json = account.toJSON();

      expect(json.path).toEqual(['41', '411', '4111']);
      expect(json.pathString).toBe('41 > 411 > 4111');
    });

    test('toString and toDetailedString produce expected format', () => {
      const account = registry.getByCode('4111')!;
      expect(account.toString()).toBe(`4111 - ${account.name}`);
      expect(account.toDetailedString()).toBe(`${account.pathString}: ${account.name}`);
    });
  });

  describe('isAccount type guard', () => {
    test('returns true for Account instances', () => {
      const account = registry.getByCode('4111')!;
      expect(isAccount(account)).toBe(true);
    });

    test('returns false for plain objects', () => {
      expect(isAccount({ code: '4111', name: 'test' })).toBe(false);
      expect(isAccount(null)).toBe(false);
      expect(isAccount(undefined)).toBe(false);
      expect(isAccount('4111')).toBe(false);
    });
  });

  describe('Static constructors', () => {
    test('fromRawData creates valid account', () => {
      const account = Account.fromRawData({
        code: '999',
        name: 'Test',
        level: 3,
        classCode: '9',
        parentCode: '99',
      });
      expect(account.code).toBe('999');
      expect(account.level).toBe(3);
    });

    test('fromRawData with metadata', () => {
      const account = Account.fromRawData(
        { code: '999', name: 'Test', level: 3, classCode: '9' },
        { isCommon: true, tags: ['custom'] }
      );
      expect(account.metadata?.isCommon).toBe(true);
      expect(account.metadata?.tags).toEqual(['custom']);
    });
  });
});
