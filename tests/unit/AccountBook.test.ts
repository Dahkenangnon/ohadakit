/**
 * AccountBook unit tests
 */

import { AccountBook, createAccountBook } from '../../src/AccountBook';
import { MemoryStorage } from '../../src/storage/MemoryStorage';
import { resetDefaultRegistry } from '../../src/core/AccountRegistry';
import { AccountNotFoundError } from '../../src/validation/errors';
import type { AccountBookSnapshot } from '../../src/core/types';

describe('AccountBook', () => {
  let storage: MemoryStorage;
  let book: AccountBook;

  beforeEach(async () => {
    resetDefaultRegistry();
    storage = new MemoryStorage();
    book = new AccountBook({ storage });
    await book.initialize();
  });

  // ── Lifecycle ──────────────────────────────────────────────────────

  describe('Lifecycle', () => {
    test('initialize() sets initialized flag', () => {
      expect(book.isInitialized()).toBe(true);
    });

    test('double initialize() is idempotent', async () => {
      await book.initialize();
      expect(book.isInitialized()).toBe(true);
    });

    test('methods throw before initialize()', () => {
      resetDefaultRegistry();
      const uninit = new AccountBook({ storage: new MemoryStorage() });
      expect(() => uninit.getAccountOrNull('411')).toThrow(
        'AccountBook is not initialized'
      );
    });

    test('deleteNote() throws before initialize()', async () => {
      resetDefaultRegistry();
      const uninit = new AccountBook({ storage: new MemoryStorage() });
      await expect(uninit.deleteNote('411')).rejects.toThrow(
        'AccountBook is not initialized'
      );
    });

    test('query() throws before initialize()', () => {
      resetDefaultRegistry();
      const uninit = new AccountBook({ storage: new MemoryStorage() });
      expect(() => uninit.query()).toThrow(
        'AccountBook is not initialized'
      );
    });
  });

  // ── Account Access ─────────────────────────────────────────────────

  describe('Account Access', () => {
    test('getAccount() returns Ok for official account', () => {
      const result = book.getAccount('411');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('411');
      }
    });

    test('getAccount() returns Err for missing account', () => {
      const result = book.getAccount('999Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(AccountNotFoundError);
      }
    });

    test('getAccountOrNull() returns Account for valid code', () => {
      const account = book.getAccountOrNull('4111');
      expect(account).not.toBeNull();
      expect(account?.code).toBe('4111');
    });

    test('getAccountOrNull() returns null for missing code', () => {
      expect(book.getAccountOrNull('999Z')).toBeNull();
    });

    test('getAccountOrThrow() returns Account for valid code', () => {
      const account = book.getAccountOrThrow('4111');
      expect(account.code).toBe('4111');
    });

    test('getAccountOrThrow() throws for missing code', () => {
      expect(() => book.getAccountOrThrow('999Z')).toThrow(
        AccountNotFoundError
      );
    });

    test('has() returns true for official account', () => {
      expect(book.has('411')).toBe(true);
    });

    test('has() returns false for non-existent account', () => {
      expect(book.has('999Z')).toBe(false);
    });

    test('has() returns true for custom account after creation', async () => {
      await book.createAccount({
        code: '411A',
        name: 'Clients A',
        parentCode: '411',
      });
      expect(book.has('411A')).toBe(true);
    });

    test('getAllAccounts() returns official + custom', async () => {
      const beforeCount = book.getAllAccounts().length;
      await book.createAccount({
        code: '411A',
        name: 'Clients A',
        parentCode: '411',
      });
      expect(book.getAllAccounts().length).toBe(beforeCount + 1);
    });

    test('getAccountOrNull() returns custom account with label override applied', async () => {
      await book.updateLabel('4111', 'Clients Particuliers Custom');
      const account = book.getAccountOrNull('4111');
      expect(account?.name).toBe('Clients Particuliers Custom');
    });
  });

  // ── Custom Accounts ────────────────────────────────────────────────

  describe('Custom Accounts', () => {
    test('createAccount() creates a custom account', async () => {
      const result = await book.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('411-VIP');
        expect(result.data.name).toBe('Clients VIP');
      }
    });

    test('deleteAccount() removes custom account', async () => {
      await book.createAccount({
        code: '411B',
        name: 'Clients B',
        parentCode: '411',
      });
      expect(book.has('411B')).toBe(true);

      const result = await book.deleteAccount('411B');
      expect(result.ok).toBe(true);
      expect(book.has('411B')).toBe(false);
    });

    test('deleteAccount() cleans up associated notes', async () => {
      await book.createAccount({
        code: '411C',
        name: 'Clients C',
        parentCode: '411',
      });
      await book.setNote('411C', 'Some note');
      expect(await book.getNote('411C')).toBe('Some note');

      await book.deleteAccount('411C');
      // Note should be cleaned up — account no longer exists so getNote throws
      // But the storage key should be removed
      const notes = await storage.getAll();
      const hasNoteKey = Array.from(notes.keys()).some(k => k.includes('411C'));
      expect(hasNoteKey).toBe(false);
    });

    test('updateLabel() on official account creates override', async () => {
      const result = await book.updateLabel('4111', 'Mon label custom');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toBe('Mon label custom');
      }
      expect(book.getAccountOrNull('4111')?.name).toBe('Mon label custom');
    });

    test('updateLabel() on custom account updates directly', async () => {
      await book.createAccount({
        code: '411D',
        name: 'Original',
        parentCode: '411',
      });
      const result = await book.updateLabel('411D', 'Updated');
      expect(result.ok).toBe(true);
      expect(book.getAccountOrNull('411D')?.name).toBe('Updated');
    });

    test('getCustomAccounts() returns only custom accounts', async () => {
      expect(book.getCustomAccounts().length).toBe(0);
      await book.createAccount({
        code: '411E',
        name: 'Custom E',
        parentCode: '411',
      });
      const customs = book.getCustomAccounts();
      expect(customs.length).toBe(1);
      expect(customs[0].code).toBe('411E');
    });

    test('getLabelOverrides() returns overrides', async () => {
      expect(book.getLabelOverrides().length).toBe(0);
      await book.updateLabel('4111', 'Custom label');
      const overrides = book.getLabelOverrides();
      expect(overrides.length).toBe(1);
      expect(overrides[0].code).toBe('4111');
      expect(overrides[0].customName).toBe('Custom label');
    });
  });

  // ── Notes ──────────────────────────────────────────────────────────

  describe('Notes', () => {
    test('setNote() + getNote() on official account', async () => {
      await book.setNote('411', 'Official note');
      expect(await book.getNote('411')).toBe('Official note');
    });

    test('setNote() + getNote() on custom account', async () => {
      await book.createAccount({
        code: '411F',
        name: 'Custom F',
        parentCode: '411',
      });
      await book.setNote('411F', 'Custom note');
      expect(await book.getNote('411F')).toBe('Custom note');
    });

    test('setNote() throws for non-existent account', async () => {
      await expect(book.setNote('999Z', 'Nope')).rejects.toThrow(
        AccountNotFoundError
      );
    });

    test('getNote() throws for non-existent account', async () => {
      await expect(book.getNote('999Z')).rejects.toThrow(
        AccountNotFoundError
      );
    });

    test('deleteNote() removes note', async () => {
      await book.setNote('411', 'To delete');
      await book.deleteNote('411');
      expect(await book.getNote('411')).toBeNull();
    });

    test('getAllNotes() returns all notes', async () => {
      await book.setNote('411', 'Note 1');
      await book.setNote('4111', 'Note 2');
      const notes = await book.getAllNotes();
      expect(notes.size).toBe(2);
      expect(notes.get('411')).toBe('Note 1');
      expect(notes.get('4111')).toBe('Note 2');
    });

    test('concurrent setNote() calls do not lose data', async () => {
      await Promise.all([
        book.setNote('411', 'Note A'),
        book.setNote('4111', 'Note B'),
      ]);
      const notes = await book.getAllNotes();
      expect(notes.size).toBe(2);
      expect(notes.get('411')).toBe('Note A');
      expect(notes.get('4111')).toBe('Note B');
    });

    test('getNote() is consistent with getAllNotes()', async () => {
      await book.setNote('411', 'Consistency check');
      const single = await book.getNote('411');
      const all = await book.getAllNotes();
      expect(single).toBe(all.get('411'));
    });

    test('clearAllNotes() removes all notes', async () => {
      await book.setNote('411', 'N1');
      await book.setNote('4111', 'N2');
      await book.clearAllNotes();
      const notes = await book.getAllNotes();
      expect(notes.size).toBe(0);
    });
  });

  // ── Query ──────────────────────────────────────────────────────────

  describe('Query', () => {
    test('query() works on official registry', () => {
      const results = book.query().inClass('4').atLevel(3).execute();
      expect(results.length).toBeGreaterThan(0);
      results.forEach(acc => {
        expect(acc.classCode).toBe('4');
        expect(acc.level).toBe(3);
      });
    });

    test('query() does not include custom accounts', async () => {
      await book.createAccount({
        code: '411G',
        name: 'Custom G',
        parentCode: '411',
      });
      const results = book.query().inClass('4').execute();
      const found = results.find(a => a.code === '411G');
      expect(found).toBeUndefined();
    });
  });

  // ── i18n ───────────────────────────────────────────────────────────

  describe('i18n', () => {
    test('getLocalizedName() returns name for valid account', () => {
      const name = book.getLocalizedName('10');
      expect(name).not.toBeNull();
      expect(typeof name).toBe('string');
    });

    test('getLocalizedName() returns null for missing account', () => {
      expect(book.getLocalizedName('999Z')).toBeNull();
    });

    test('getLocale() returns default locale', () => {
      expect(book.getLocale()).toBe('fr');
    });

    test('setLocale() changes locale', () => {
      book.setLocale('en');
      expect(book.getLocale()).toBe('en');
    });

    test('constructor respects locale option', async () => {
      resetDefaultRegistry();
      const enBook = new AccountBook({
        storage: new MemoryStorage(),
        locale: 'en',
      });
      await enBook.initialize();
      expect(enBook.getLocale()).toBe('en');
    });

    test('getAvailableLocales() returns 4 locales', () => {
      expect(book.getAvailableLocales()).toEqual(['fr', 'en', 'pt', 'es']);
    });
  });

  // ── Export ──────────────────────────────────────────────────────────

  describe('Export', () => {
    test('exportToJSON() includes custom accounts', async () => {
      await book.createAccount({
        code: '411H',
        name: 'Custom H',
        parentCode: '411',
      });
      const json = book.exportToJSON({ pretty: false });
      const parsed = JSON.parse(json);
      const found = parsed.find((a: any) => a.code === '411H');
      expect(found).toBeTruthy();
      expect(found.name).toBe('Custom H');
    });

    test('exportToCSV() includes custom accounts', async () => {
      await book.createAccount({
        code: '411I',
        name: 'Custom I',
        parentCode: '411',
      });
      const csv = book.exportToCSV();
      expect(csv).toContain('411I');
      expect(csv).toContain('Custom I');
    });

    test('exportClass() returns merged official + custom for a class', async () => {
      await book.createAccount({
        code: '411J',
        name: 'Custom J',
        parentCode: '411',
      });
      const json = book.exportClass('4', 'json', { pretty: false });
      const parsed = JSON.parse(json);
      const found = parsed.find((a: any) => a.code === '411J');
      expect(found).toBeTruthy();
    });

    test('export reflects label overrides', async () => {
      await book.updateLabel('4111', 'Label Override');
      const json = book.exportToJSON({ pretty: false });
      const parsed = JSON.parse(json);
      const account = parsed.find((a: any) => a.code === '4111');
      expect(account.name).toBe('Label Override');
    });
  });

  // ── Snapshot / Restore ─────────────────────────────────────────────

  describe('Snapshot / Restore', () => {
    test('snapshot() produces a valid object', async () => {
      const snap = await book.snapshot();
      expect(snap.version).toBe(1);
      expect(snap.timestamp).toBeTruthy();
      expect(snap.locale).toBe('fr');
      expect(Array.isArray(snap.customAccounts)).toBe(true);
      expect(Array.isArray(snap.labelOverrides)).toBe(true);
      expect(typeof snap.notes).toBe('object');
    });

    test('snapshot() is JSON-serializable', async () => {
      await book.createAccount({
        code: '411K',
        name: 'Custom K',
        parentCode: '411',
      });
      await book.setNote('411', 'Snap note');
      const snap = await book.snapshot();
      const json = JSON.stringify(snap);
      const parsed = JSON.parse(json) as AccountBookSnapshot;
      expect(parsed.customAccounts.length).toBe(1);
      expect(parsed.notes['411']).toBe('Snap note');
    });

    test('round-trip snapshot/restore preserves state', async () => {
      // Set up state
      await book.createAccount({
        code: '411L',
        name: 'Custom L',
        parentCode: '411',
      });
      await book.updateLabel('4111', 'Overridden');
      await book.setNote('411', 'My note');
      book.setLocale('en');

      const snap = await book.snapshot();

      // Create fresh book
      resetDefaultRegistry();
      const newStorage = new MemoryStorage();
      const newBook = new AccountBook({ storage: newStorage });
      await newBook.initialize();

      const result = await newBook.restore(snap);
      expect(result.ok).toBe(true);

      // Verify state
      expect(newBook.has('411L')).toBe(true);
      expect(newBook.getAccountOrNull('411L')?.name).toBe('Custom L');
      expect(newBook.getAccountOrNull('4111')?.name).toBe('Overridden');
      expect(await newBook.getNote('411')).toBe('My note');
      expect(newBook.getLocale()).toBe('en');
    });

    test('restore() clears existing state first', async () => {
      await book.createAccount({
        code: '411M',
        name: 'Old',
        parentCode: '411',
      });
      await book.setNote('411', 'Old note');

      // Restore empty snapshot
      const emptySnap: AccountBookSnapshot = {
        version: 1,
        timestamp: new Date().toISOString(),
        locale: 'fr',
        customAccounts: [],
        labelOverrides: [],
        notes: {},
      };

      const result = await book.restore(emptySnap);
      expect(result.ok).toBe(true);
      expect(book.has('411M')).toBe(false);
      expect(await book.getNote('411')).toBeNull();
    });

    test('restore() sorts by level (parents before children)', async () => {
      // Create parent then child
      await book.createAccount({
        code: '411N',
        name: 'Parent N',
        parentCode: '411',
      });
      await book.createAccount({
        code: '411N1',
        name: 'Child N1',
        parentCode: '411N',
      });

      const snap = await book.snapshot();

      // Scramble order — put child before parent
      snap.customAccounts.reverse();

      // Restore into fresh book
      resetDefaultRegistry();
      const newBook = new AccountBook({ storage: new MemoryStorage() });
      await newBook.initialize();

      const result = await newBook.restore(snap);
      expect(result.ok).toBe(true);
      expect(newBook.has('411N')).toBe(true);
      expect(newBook.has('411N1')).toBe(true);
    });

    test('restore() rejects future version', async () => {
      const futureSnap: AccountBookSnapshot = {
        version: 999,
        timestamp: new Date().toISOString(),
        locale: 'fr',
        customAccounts: [],
        labelOverrides: [],
        notes: {},
      };

      const result = await book.restore(futureSnap);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('999');
      }
    });

    test('restore() rejects malformed snapshot (missing customAccounts)', async () => {
      const malformed = { version: 1, locale: 'fr', notes: {} } as unknown as AccountBookSnapshot;
      const result = await book.restore(malformed);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('customAccounts');
      }
    });

    test('restore() rejects snapshot with invalid locale', async () => {
      const bad: AccountBookSnapshot = {
        version: 1,
        timestamp: new Date().toISOString(),
        locale: 'xx' as any,
        customAccounts: [],
        labelOverrides: [],
        notes: {},
      };
      const result = await book.restore(bad);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('locale');
      }
    });

    test('restore() rejects null snapshot', async () => {
      const result = await book.restore(null as unknown as AccountBookSnapshot);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Invalid snapshot');
      }
    });

    test('snapshot() returns defensive copies (mutation-safe)', async () => {
      await book.createAccount({
        code: '411S',
        name: 'Snapshot S',
        parentCode: '411',
      });
      const snap = await book.snapshot();
      // Mutate the snapshot arrays
      snap.customAccounts[0].name = 'MUTATED';
      // Internal state should be unaffected
      expect(book.getAccountOrNull('411S')?.name).toBe('Snapshot S');
    });

    test('snapshot includes notes for custom accounts', async () => {
      await book.createAccount({
        code: '411O',
        name: 'Custom O',
        parentCode: '411',
      });
      await book.setNote('411O', 'Custom note');
      const snap = await book.snapshot();
      expect(snap.notes['411O']).toBe('Custom note');
    });
  });

  // ── Stats ──────────────────────────────────────────────────────────

  describe('Stats', () => {
    test('getStats() includes registry stats', async () => {
      const stats = await book.getStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(typeof stats.byClass).toBe('object');
      expect(typeof stats.byLevel).toBe('object');
    });

    test('getStats() counts custom accounts', async () => {
      await book.createAccount({
        code: '411P',
        name: 'Custom P',
        parentCode: '411',
      });
      const stats = await book.getStats();
      expect(stats.customAccountCount).toBe(1);
    });

    test('getStats() counts notes', async () => {
      await book.setNote('411', 'Note');
      await book.setNote('4111', 'Note 2');
      const stats = await book.getStats();
      expect(stats.noteCount).toBe(2);
    });

    test('getStats() counts label overrides', async () => {
      await book.updateLabel('4111', 'Override');
      const stats = await book.getStats();
      expect(stats.labelOverrideCount).toBe(1);
    });
  });

  // ── Escape Hatches ─────────────────────────────────────────────────

  describe('Escape Hatches', () => {
    test('registry property is accessible', () => {
      expect(book.registry).toBeDefined();
      expect(book.registry.size).toBeGreaterThan(0);
    });

    test('customManager property is accessible', () => {
      expect(book.customManager).toBeDefined();
      expect(book.customManager.isInitialized()).toBe(true);
    });

    test('i18n property is accessible', () => {
      expect(book.i18n).toBeDefined();
      expect(book.i18n.getLocale()).toBe('fr');
    });
  });

  // ── Factory ────────────────────────────────────────────────────────

  describe('createAccountBook', () => {
    test('creates with defaults', async () => {
      resetDefaultRegistry();
      const defaultBook = createAccountBook();
      await defaultBook.initialize();
      expect(defaultBook.isInitialized()).toBe(true);
      expect(defaultBook.has('411')).toBe(true);
    });

    test('accepts partial options', async () => {
      resetDefaultRegistry();
      const customBook = createAccountBook({ locale: 'en' });
      await customBook.initialize();
      expect(customBook.getLocale()).toBe('en');
    });
  });
});
