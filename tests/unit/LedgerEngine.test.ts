/**
 * LedgerEngine unit tests
 */

import { LedgerEngine } from '../../src/LedgerEngine';
import { MemoryStorage } from '../../src/storage/MemoryStorage';
import {
  AccountNotFoundError,
  InvalidAccountCodeFormatError,
} from '../../src/validation/errors';

describe('LedgerEngine', () => {
  let ledger: LedgerEngine;

  beforeEach(() => {
    ledger = new LedgerEngine();
  });

  describe('Account Access', () => {
    test('get() returns account for valid code', () => {
      const result = ledger.get('4111');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('4111');
        expect(result.data.name).toContain('Client');
      }
    });

    test('get() returns error for invalid code', () => {
      const result = ledger.get('9999');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(AccountNotFoundError);
      }
    });

    test('get() returns error for malformed code', () => {
      const result = ledger.get('invalid');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidAccountCodeFormatError);
      }
    });

    test('getOrNull() returns account for valid code', () => {
      const account = ledger.getOrNull('4111');
      expect(account).not.toBeNull();
      expect(account?.code).toBe('4111');
    });

    test('getOrNull() returns null for invalid code', () => {
      const account = ledger.getOrNull('9999');
      expect(account).toBeNull();
    });

    test('getOrThrow() returns account for valid code', () => {
      const account = ledger.getOrThrow('4111');
      expect(account.code).toBe('4111');
    });

    test('getOrThrow() throws for invalid code', () => {
      expect(() => ledger.getOrThrow('9999')).toThrow(AccountNotFoundError);
    });

    test('registry.has() returns true for existing account', () => {
      expect(ledger.registry.has('4111')).toBe(true);
    });

    test('registry.has() returns false for non-existing account', () => {
      expect(ledger.registry.has('9999')).toBe(false);
    });

    test('registry.getByClass() returns accounts in class', () => {
      const accounts = ledger.registry.getByClass('4');
      expect(accounts.length).toBeGreaterThan(0);
      accounts.forEach(acc => {
        expect(acc.classCode).toBe('4');
      });
    });

    test('registry.getByLevel() returns accounts at level', () => {
      const accounts = ledger.registry.getByLevel(3);
      expect(accounts.length).toBeGreaterThan(0);
      accounts.forEach(acc => {
        expect(acc.level).toBe(3);
      });
    });

    test('registry.getAll() returns all accounts', () => {
      const accounts = ledger.registry.getAll();
      expect(accounts.length).toBeGreaterThan(0);
    });
  });

  describe('Search & Query', () => {
    test('query().nameContains() finds accounts by name', () => {
      const results = ledger.query()
        .nameContains('fournisseur')
        .execute();
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.name.toLowerCase()).toContain('fournisseur');
      });
    });

    test('query().nameContains() with limit', () => {
      const results = ledger.query()
        .nameContains('compte')
        .limit(5)
        .execute();
      expect(results.length).toBeLessThanOrEqual(5);
    });

    test('registry.searchByPrefix() finds accounts by code prefix', () => {
      const results = ledger.registry.searchByPrefix('41');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.code.startsWith('41')).toBe(true);
      });
    });

    test('query builder with single filter', () => {
      const results = ledger.query()
        .inClass('4')
        .execute();
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.classCode).toBe('4');
      });
    });

    test('query builder with multiple filters', () => {
      const results = ledger.query()
        .inClass('4')
        .atLevel(3)
        .execute();
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.classCode).toBe('4');
        expect(acc.level).toBe(3);
      });
    });

    test('query builder with name filter', () => {
      const results = ledger.query()
        .nameContains('client')
        .execute();
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.name.toLowerCase()).toContain('client');
      });
    });

    test('query builder with sorting', () => {
      const results = ledger.query()
        .inClass('4')
        .sortBy('code', 'asc')
        .execute();

      for (let i = 1; i < results.length; i++) {
        expect(results[i].code >= results[i - 1].code).toBe(true);
      }
    });

    test('query builder with limit', () => {
      const results = ledger.query()
        .inClass('4')
        .limit(10)
        .execute();
      expect(results.length).toBeLessThanOrEqual(10);
    });

    test('query builder count()', () => {
      const count = ledger.query()
        .inClass('4')
        .count();
      expect(count).toBeGreaterThan(0);
    });

    test('query builder first()', () => {
      const first = ledger.query()
        .inClass('4')
        .first();
      expect(first).not.toBeNull();
      expect(first?.classCode).toBe('4');
    });

    test('query builder exists()', () => {
      const exists = ledger.query()
        .inClass('4')
        .exists();
      expect(exists).toBe(true);

      const notExists = ledger.query()
        .codeMatches(/^999/)
        .exists();
      expect(notExists).toBe(false);
    });
  });

  describe('Validation', () => {
    test('get() accepts valid code', () => {
      const result = ledger.get('4111');
      expect(result.ok).toBe(true);
    });

    test('get() rejects invalid code', () => {
      const result = ledger.get('9999');
      expect(result.ok).toBe(false);
    });

    test('validateBatch() processes multiple codes', () => {
      const codes = ['4111', '5211', '9999', 'invalid'];
      const { valid, invalid } = ledger.validateBatch(codes);

      expect(valid.length).toBe(2);
      expect(invalid.length).toBe(2);

      expect(valid[0].code).toBe('4111');
      expect(valid[1].code).toBe('5211');

      expect(invalid[0].code).toBe('9999');
      expect(invalid[1].code).toBe('invalid');
    });
  });

  describe('Notes/Storage', () => {
    test('setNote() and getNote() work correctly', async () => {
      const code = '4111';
      const note = 'Test note';

      await ledger.setNote(code, note);
      const retrieved = await ledger.getNote(code);

      expect(retrieved).toBe(note);
    });

    test('setNote() throws for invalid account', async () => {
      await expect(
        ledger.setNote('9999', 'Test note')
      ).rejects.toThrow(AccountNotFoundError);
    });

    test('deleteNote() removes note', async () => {
      const code = '4111';
      await ledger.setNote(code, 'Test note');
      await ledger.deleteNote(code);

      const retrieved = await ledger.getNote(code);
      expect(retrieved).toBeNull();
    });

    test('hasNote() returns correct status', async () => {
      const code = '4111';

      expect(await ledger.hasNote(code)).toBe(false);

      await ledger.setNote(code, 'Test note');
      expect(await ledger.hasNote(code)).toBe(true);

      await ledger.deleteNote(code);
      expect(await ledger.hasNote(code)).toBe(false);
    });

    test('getAllNotes() returns all notes', async () => {
      await ledger.setNote('4111', 'Note 1');
      await ledger.setNote('5211', 'Note 2');

      const allNotes = await ledger.getAllNotes();
      expect(allNotes.size).toBeGreaterThanOrEqual(2);
      expect(allNotes.get('4111')).toBe('Note 1');
      expect(allNotes.get('5211')).toBe('Note 2');
    });

    test('clearAllNotes() removes all notes', async () => {
      await ledger.setNote('4111', 'Note 1');
      await ledger.setNote('5211', 'Note 2');
      await ledger.clearAllNotes();

      const allNotes = await ledger.getAllNotes();
      expect(allNotes.size).toBe(0);
    });
  });

  describe('Export', () => {
    test('exportToJSON() returns valid JSON', () => {
      const json = ledger.exportToJSON({ pretty: false });
      expect(() => JSON.parse(json)).not.toThrow();

      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    });

    test('exportToCSV() returns CSV string', () => {
      const csv = ledger.exportToCSV();
      expect(csv).toContain('code');
      expect(csv).toContain('name');

      const lines = csv.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    test('exportClass() exports specific class', () => {
      const json = ledger.exportClass('4', 'json', {
        pretty: false
      });
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      parsed.forEach((acc: any) => {
        expect(acc.classCode).toBe('4');
      });
    });
  });

  describe('Statistics', () => {
    test('getStats() returns statistics', () => {
      const stats = ledger.getStats();

      expect(stats.total).toBeGreaterThan(0);
      expect(typeof stats.byClass).toBe('object');
      expect(typeof stats.byLevel).toBe('object');
    });

    test('registry.size returns count', () => {
      const count = ledger.registry.size;
      expect(count).toBeGreaterThan(0);
    });

    test('registry.getClassMetadata() returns class info', () => {
      const metadata = ledger.registry.getClassMetadata('4');
      expect(metadata).not.toBeNull();
      expect(metadata?.code).toBe('4');
      expect(metadata?.name).toBeTruthy();
      expect(metadata?.nameEn).toBeTruthy();
    });
  });

  describe('Advanced Features', () => {
    test('account relationships are accessible directly', () => {
      const account = ledger.getOrThrow('4111');
      expect(account).toBeTruthy();
      expect(account.parent).toBeTruthy();
      expect(Array.isArray(account.children)).toBe(true);
      expect(Array.isArray(account.siblings)).toBe(true);
      expect(Array.isArray(account.ancestors)).toBe(true);
    });

    test('registry.getSubtree() returns subtree', () => {
      const tree = ledger.registry.getSubtree('41');
      expect(tree.length).toBeGreaterThan(0);
      expect(tree[0].code).toBe('41');
    });

    test('registry.getPath() returns path from root', () => {
      const path = ledger.registry.getPath('4111');
      expect(path.length).toBeGreaterThan(0);

      const codes = path.map(acc => acc.code);
      expect(codes).toContain('41');
      expect(codes).toContain('411');
      expect(codes).toContain('4111');
      expect(codes[codes.length - 1]).toBe('4111');
    });

    test('registry.getLeafAccounts() returns accounts without children', () => {
      const leafAccounts = ledger.registry.getLeafAccounts();
      expect(leafAccounts.length).toBeGreaterThan(0);

      leafAccounts.forEach(acc => {
        expect(acc.children.length).toBe(0);
        expect(acc.isLeaf).toBe(true);
      });
    });

    test('registry.getRootAccounts() returns top-level accounts', () => {
      const rootAccounts = ledger.registry.getRootAccounts();
      expect(rootAccounts.length).toBeGreaterThan(0);

      rootAccounts.forEach(acc => {
        expect(acc.parentCode).toBeUndefined();
        expect(acc.isRoot).toBe(true);
      });
    });
  });

  describe('Public Properties', () => {
    test('registry is publicly accessible', () => {
      expect(ledger.registry).toBeDefined();
      expect(ledger.registry.size).toBeGreaterThan(0);
    });

    test('storage is publicly accessible', () => {
      expect(ledger.storage).toBeDefined();
    });

    test('i18n is publicly accessible', () => {
      expect(ledger.i18n).toBeDefined();
      expect(ledger.i18n.getLocale()).toBe('fr');
    });
  });

  describe('Custom Storage', () => {
    test('works with custom storage adapter', async () => {
      const customStorage = new MemoryStorage();
      const customLedger = new LedgerEngine({
        storage: customStorage
      });

      await customLedger.setNote('4111', 'Custom note');
      const note = await customLedger.getNote('4111');

      expect(note).toBe('Custom note');
    });
  });

  describe('i18n Integration', () => {
    test('getLocalizedName returns translated name when locale has translation', () => {
      const localizedLedger = new LedgerEngine({ locale: 'en' });
      const name = localizedLedger.getLocalizedName('10');
      expect(name).not.toBeNull();
      expect(typeof name).toBe('string');
    });

    test('getLocalizedName returns null for non-existent account', () => {
      const name = ledger.getLocalizedName('9999');
      expect(name).toBeNull();
    });

    test('setLocale changes locale, getLocale reflects it', () => {
      ledger.setLocale('en');
      expect(ledger.getLocale()).toBe('en');

      ledger.setLocale('fr');
      expect(ledger.getLocale()).toBe('fr');
    });

    test('getAvailableLocales returns 4 locales', () => {
      const locales = ledger.getAvailableLocales();
      expect(locales).toEqual(['fr', 'en', 'pt', 'es']);
      expect(locales.length).toBe(4);
    });

    test('setLocale with invalid locale throws', () => {
      expect(() => ledger.setLocale('xx' as any)).toThrow('Invalid locale');
    });

    test('constructor with locale option', () => {
      const enLedger = new LedgerEngine({ locale: 'en' });
      expect(enLedger.getLocale()).toBe('en');
    });

    test('getLocalizedName falls back to French for default locale', () => {
      const frLedger = new LedgerEngine({ locale: 'fr' });
      const name = frLedger.getLocalizedName('10');
      expect(name).not.toBeNull();
    });
  });

  describe('Integrity', () => {
    test('registry.validateIntegrity() passes for valid registry', () => {
      const integrity = ledger.registry.validateIntegrity();
      expect(integrity.valid).toBe(true);
      expect(integrity.errors.length).toBe(0);
    });
  });
});
