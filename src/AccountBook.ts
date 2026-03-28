/**
 * AccountBook — Unified facade for OhadaKit.
 *
 * Wraps CustomAccountManager + notes storage + i18n + export into a single
 * entry point. Provides snapshot/restore for chart-of-accounts state.
 */

import type { Account } from './core/Account';
import { getDefaultRegistry, type AccountRegistry } from './core/AccountRegistry';
import { QueryBuilder } from './query/QueryEngine';
import { JsonExporter, CsvExporter } from './export/Exporter';
import { MemoryStorage } from './storage/MemoryStorage';
import { CustomAccountManager } from './custom/CustomAccountManager';
import { TranslationService } from './i18n/TranslationService';
import { AccountNotFoundError, StorageError } from './validation/errors';
import type {
  Result,
  StorageAdapter,
  AccountBookOptions,
  AccountBookSnapshot,
  AccountBookStats,
  JsonExportOptions,
  CsvExportOptions,
  OhadaLocale,
} from './core/types';
import { Ok, Err } from './core/types';
import type { CustomAccountInput, LabelOverride } from './custom/types';
import { DEFAULT_STORAGE_PREFIX } from './custom/types';

const SNAPSHOT_VERSION = 1;
const NOTES_KEY_PREFIX = 'notes:';

/**
 * Unified facade for the OHADA chart of accounts.
 *
 * Combines official accounts, custom accounts, label overrides, notes,
 * i18n, and export into a single API surface.
 *
 * @example
 * ```typescript
 * const book = createAccountBook({ storage: new MemoryStorage() });
 * await book.initialize();
 *
 * // Access official + custom accounts
 * const account = book.getAccountOrNull('411');
 *
 * // Create custom sub-accounts
 * await book.createAccount({ code: '411-VIP', name: 'Clients VIP', parentCode: '411' });
 *
 * // Attach notes to any account
 * await book.setNote('411', 'Main client account');
 *
 * // Snapshot/restore
 * const snap = await book.snapshot();
 * await book.restore(snap);
 * ```
 */
export class AccountBook {
  /** The underlying OHADA account registry (official accounts only) */
  readonly registry: AccountRegistry;
  /** The custom account manager (custom accounts + label overrides) */
  readonly customManager: CustomAccountManager;
  /** The translation service */
  readonly i18n: TranslationService;

  private readonly storage: StorageAdapter;
  private readonly storagePrefix: string;
  private readonly notesCache: Map<string, string> = new Map();
  private notesCacheLoaded = false;
  private initialized = false;

  constructor(options: AccountBookOptions) {
    this.registry = getDefaultRegistry();
    this.storage = options.storage;
    this.storagePrefix = options.storagePrefix ?? DEFAULT_STORAGE_PREFIX;
    this.i18n = new TranslationService(options.locale ?? 'fr');
    this.customManager = new CustomAccountManager({
      storage: options.storage,
      storagePrefix: this.storagePrefix,
    });
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.customManager.initialize();
    await this.loadNotesCache();
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // ── Account Access ─────────────────────────────────────────────────

  /** Look up an account (official or custom, with label overrides applied). */
  getAccount(code: string): Result<Account> {
    this.ensureInitialized();
    const account = this.customManager.getByCode(code);
    if (!account) {
      return Err(new AccountNotFoundError(code));
    }
    return Ok(account);
  }

  getAccountOrNull(code: string): Account | null {
    this.ensureInitialized();
    return this.customManager.getByCode(code);
  }

  /** @throws {AccountNotFoundError} */
  getAccountOrThrow(code: string): Account {
    this.ensureInitialized();
    const account = this.customManager.getByCode(code);
    if (!account) {
      throw new AccountNotFoundError(code);
    }
    return account;
  }

  /** Check whether an account code exists (official or custom). */
  has(code: string): boolean {
    this.ensureInitialized();
    return this.customManager.has(code);
  }

  /** Get all accounts (official + custom, with label overrides applied). */
  getAllAccounts(): Account[] {
    this.ensureInitialized();
    return this.customManager.getAll();
  }

  // ── Query ──────────────────────────────────────────────────────────

  /**
   * Create a fluent query builder for the official OHADA account registry.
   *
   * Custom accounts are NOT included in query results.
   * Use `getCustomAccounts()` or `getAllAccounts()` to access custom accounts.
   */
  query(): QueryBuilder {
    this.ensureInitialized();
    return new QueryBuilder(this.registry);
  }

  // ── Custom Accounts ────────────────────────────────────────────────

  async createAccount(input: CustomAccountInput): Promise<Result<Account>> {
    this.ensureInitialized();
    return this.customManager.createAccount(input);
  }

  async deleteAccount(code: string): Promise<Result<void>> {
    this.ensureInitialized();
    const result = await this.customManager.deleteCustomAccount(code);
    if (result.ok) {
      // Best-effort cleanup of associated note
      try {
        const key = this.notesKey(code);
        await this.storage.delete(key);
        this.notesCache.delete(code);
      } catch {
        // Ignore — the account is already gone
      }
    }
    return result;
  }

  async updateLabel(code: string, newLabel: string): Promise<Result<Account>> {
    this.ensureInitialized();
    return this.customManager.updateLabel(code, newLabel);
  }

  getCustomAccounts(): Account[] {
    this.ensureInitialized();
    return this.customManager.getCustomAccounts();
  }

  getLabelOverrides(): LabelOverride[] {
    this.ensureInitialized();
    return this.customManager.getLabelOverrides();
  }

  // ── Notes ──────────────────────────────────────────────────────────

  /** Set a note on an official or custom account. @throws {AccountNotFoundError} */
  async setNote(code: string, note: string): Promise<void> {
    this.ensureInitialized();
    if (!this.has(code)) {
      throw new AccountNotFoundError(code);
    }
    try {
      const key = this.notesKey(code);
      await this.storage.set(key, note);
      this.notesCache.set(code, note);
    } catch (error) {
      if (error instanceof AccountNotFoundError) throw error;
      throw new StorageError('setNote', `Failed to set note for ${code}`, error as Error);
    }
  }

  /** Get a note. Returns null if no note exists. @throws {AccountNotFoundError} */
  async getNote(code: string): Promise<string | null> {
    this.ensureInitialized();
    if (!this.has(code)) {
      throw new AccountNotFoundError(code);
    }
    return this.notesCache.get(code) ?? null;
  }

  /** Delete a note for an account code. */
  async deleteNote(code: string): Promise<void> {
    this.ensureInitialized();
    try {
      const key = this.notesKey(code);
      await this.storage.delete(key);
      this.notesCache.delete(code);
    } catch (error) {
      throw new StorageError('deleteNote', `Failed to delete note for ${code}`, error as Error);
    }
  }

  /** Get all notes as a Map<accountCode, noteText>. */
  async getAllNotes(): Promise<Map<string, string>> {
    this.ensureInitialized();
    await this.loadNotesCache();
    return new Map(this.notesCache);
  }

  /** Clear all notes from storage and cache. */
  async clearAllNotes(): Promise<void> {
    this.ensureInitialized();
    // Scan storage for all notes-prefixed keys, not just the cache,
    // to catch any orphaned entries
    const all = await this.storage.getAll();
    const prefix = `${this.storagePrefix}${NOTES_KEY_PREFIX}`;
    const deletePromises: Promise<void>[] = [];
    for (const [key] of all) {
      if (key.startsWith(prefix)) {
        deletePromises.push(this.storage.delete(key));
      }
    }
    await Promise.all(deletePromises);
    this.notesCache.clear();
    this.notesCacheLoaded = true;
  }

  // ── i18n ───────────────────────────────────────────────────────────

  /** Get the localized name for an account. Returns null if account not found. */
  getLocalizedName(code: string): string | null {
    const account = this.getAccountOrNull(code);
    if (!account) return null;
    return this.i18n.getAccountName(code, account.name);
  }

  getLocale(): OhadaLocale {
    return this.i18n.getLocale();
  }

  setLocale(locale: OhadaLocale): void {
    this.i18n.setLocale(locale);
  }

  getAvailableLocales(): OhadaLocale[] {
    return TranslationService.getAvailableLocales();
  }

  // ── Export ──────────────────────────────────────────────────────────

  /** Export all accounts (official + custom with overrides) to JSON. */
  exportToJSON(options?: JsonExportOptions): string {
    this.ensureInitialized();
    return JsonExporter.export(this.getAllAccounts(), options);
  }

  /** Export all accounts (official + custom with overrides) to CSV. */
  exportToCSV(options?: CsvExportOptions): string {
    this.ensureInitialized();
    return CsvExporter.export(this.getAllAccounts(), options);
  }

  /** Export a single class (merged official + custom). */
  exportClass(classCode: string, format: 'json', options?: JsonExportOptions): string;
  exportClass(classCode: string, format: 'csv', options?: CsvExportOptions): string;
  exportClass(
    classCode: string,
    format: 'json' | 'csv',
    options?: JsonExportOptions | CsvExportOptions
  ): string {
    this.ensureInitialized();
    const accounts = this.customManager.getByClass(classCode);
    switch (format) {
      case 'json':
        return JsonExporter.export(accounts, options as JsonExportOptions);
      case 'csv':
        return CsvExporter.export(accounts, options as CsvExportOptions);
    }
  }

  // ── Snapshot / Restore ─────────────────────────────────────────────

  /** Produce a plain JSON-serializable snapshot of the entire book state. */
  async snapshot(): Promise<AccountBookSnapshot> {
    this.ensureInitialized();
    await this.loadNotesCache();

    const notes: Record<string, string> = {};
    for (const [code, text] of this.notesCache) {
      notes[code] = text;
    }

    return {
      version: SNAPSHOT_VERSION,
      timestamp: new Date().toISOString(),
      locale: this.getLocale(),
      // Defensive copies to prevent mutation of internal state
      customAccounts: this.customManager.getCustomAccountData().map(d => ({ ...d })),
      labelOverrides: this.customManager.getLabelOverrides().map(o => ({ ...o })),
      notes,
    };
  }

  /**
   * Restore book state from a snapshot. Clears existing custom accounts,
   * label overrides, and notes first, then rebuilds in dependency order.
   *
   * Note: `createdAt`/`updatedAt` timestamps on custom accounts are regenerated
   * at restore time and will not match the original snapshot values.
   *
   * On failure, the book may be in a partially restored state. Take a snapshot
   * before calling `restore()` if you need rollback capability.
   */
  async restore(snap: AccountBookSnapshot): Promise<Result<void>> {
    this.ensureInitialized();

    // Runtime validation of snapshot shape (TypeScript types evaporate at runtime)
    const validationError = this.validateSnapshotShape(snap);
    if (validationError) {
      return Err(new Error(validationError));
    }

    if (snap.version > SNAPSHOT_VERSION) {
      return Err(
        new Error(
          `Snapshot version ${snap.version} is newer than supported version ${SNAPSHOT_VERSION}`
        )
      );
    }

    // 1. Clear existing state
    await this.customManager.clear();
    await this.clearAllNotes();

    // 2. Restore locale
    this.setLocale(snap.locale);

    // 3. Restore custom accounts sorted by level (parents first)
    const sorted = [...snap.customAccounts].sort((a, b) => a.level - b.level);
    for (const data of sorted) {
      const result = await this.customManager.createAccount({
        code: data.code,
        name: data.name,
        parentCode: data.parentCode,
      });
      if (!result.ok) {
        return Err(result.error);
      }
    }

    // 4. Restore label overrides
    for (const override of snap.labelOverrides) {
      const result = await this.customManager.updateLabel(
        override.code,
        override.customName
      );
      if (!result.ok) {
        return Err(result.error);
      }
    }

    // 5. Restore notes
    for (const [code, text] of Object.entries(snap.notes)) {
      const key = this.notesKey(code);
      await this.storage.set(key, text);
      this.notesCache.set(code, text);
    }

    return Ok(undefined);
  }

  // ── Stats ──────────────────────────────────────────────────────────

  async getStats(): Promise<AccountBookStats> {
    this.ensureInitialized();
    const registryStats = this.registry.getStats();
    const customStats = this.customManager.getStats();
    await this.loadNotesCache();

    return {
      ...registryStats,
      customAccountCount: customStats.customAccountCount,
      labelOverrideCount: customStats.labelOverrideCount,
      noteCount: this.notesCache.size,
    };
  }

  // ── Private helpers ────────────────────────────────────────────────

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        'AccountBook is not initialized. Call initialize() first.'
      );
    }
  }

  private notesKey(code: string): string {
    return `${this.storagePrefix}${NOTES_KEY_PREFIX}${code}`;
  }

  private async loadNotesCache(): Promise<void> {
    if (this.notesCacheLoaded) return;
    const all = await this.storage.getAll();
    const prefix = `${this.storagePrefix}${NOTES_KEY_PREFIX}`;
    this.notesCache.clear();
    for (const [key, value] of all) {
      if (key.startsWith(prefix)) {
        const code = key.slice(prefix.length);
        this.notesCache.set(code, value);
      }
    }
    this.notesCacheLoaded = true;
  }

  private validateSnapshotShape(snap: unknown): string | null {
    if (!snap || typeof snap !== 'object') {
      return 'Invalid snapshot: expected an object';
    }
    const s = snap as Record<string, unknown>;
    if (typeof s.version !== 'number') {
      return 'Invalid snapshot: missing or non-numeric version';
    }
    if (!Array.isArray(s.customAccounts)) {
      return 'Invalid snapshot: customAccounts must be an array';
    }
    if (!Array.isArray(s.labelOverrides)) {
      return 'Invalid snapshot: labelOverrides must be an array';
    }
    if (s.notes === null || typeof s.notes !== 'object' || Array.isArray(s.notes)) {
      return 'Invalid snapshot: notes must be a plain object';
    }
    if (typeof s.locale !== 'string' || !TranslationService.isValidLocale(s.locale)) {
      return `Invalid snapshot: locale must be one of ${TranslationService.getAvailableLocales().join(', ')}`;
    }
    return null;
  }
}

/**
 * Options for the `createAccountBook` factory.
 * Unlike `AccountBookOptions`, `storage` is optional and defaults to `MemoryStorage`.
 */
export interface CreateAccountBookOptions {
  /** Storage adapter. Defaults to MemoryStorage (volatile — data lost on reload). */
  storage?: StorageAdapter;
  /** Locale for internationalization (default: 'fr') */
  locale?: OhadaLocale;
  /** Storage key prefix (default: 'ohadakit:') */
  storagePrefix?: string;
}

/** Factory for creating an AccountBook with defaults. */
export function createAccountBook(options?: CreateAccountBookOptions): AccountBook {
  return new AccountBook({
    storage: options?.storage ?? new MemoryStorage(),
    locale: options?.locale,
    storagePrefix: options?.storagePrefix,
  });
}
