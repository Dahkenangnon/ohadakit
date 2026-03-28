import { Account } from './core/Account';
import { AccountRegistry, getDefaultRegistry } from './core/AccountRegistry';
import { QueryBuilder } from './query/QueryEngine';
import { validateAccountCode } from './validation/validators';
import { JsonExporter, CsvExporter } from './export/Exporter';
import { MemoryStorage } from './storage/MemoryStorage';
import type {
  Result,
  LedgerEngineOptions,
  StorageAdapter,
  RegistryStats,
  JsonExportOptions,
  CsvExportOptions,
  OhadaLocale,
} from './core/types';
import { AccountNotFoundError, StorageError } from './validation/errors';
import { TranslationService } from './i18n/TranslationService';

/**
 * Main SDK class for OHADA account management.
 * Provides unified access to all SDK features including account lookup,
 * querying, export, notes storage, and internationalization.
 *
 * @example
 * ```typescript
 * import { createLedgerEngine } from 'ohadakit';
 *
 * const ledger = createLedgerEngine();
 * const result = ledger.get('411');
 * if (result.ok) {
 *   console.log(result.data.name); // "Clients"
 * }
 * ```
 */
export class LedgerEngine {
  readonly registry: AccountRegistry;
  readonly storage: StorageAdapter;
  readonly i18n: TranslationService;

  constructor(options: LedgerEngineOptions = {}) {
    this.registry = getDefaultRegistry();
    this.storage = options.storage ?? new MemoryStorage();
    this.i18n = new TranslationService(options.locale ?? 'fr');
  }

  get(code: string): Result<Account> {
    return validateAccountCode(code, this.registry);
  }

  /** @throws {AccountNotFoundError} @throws {InvalidAccountCodeFormatError} */
  getOrThrow(code: string): Account {
    const result = this.get(code);
    if (!result.ok) {
      throw result.error;
    }
    return result.data;
  }

  getOrNull(code: string): Account | null {
    const result = this.get(code);
    return result.ok ? result.data : null;
  }

  /**
   * @example
   * ```typescript
   * ledger.query().inClass('4').atLevel(3).nameContains('client').execute();
   * ```
   */
  query(): QueryBuilder {
    return new QueryBuilder(this.registry);
  }

  validateBatch(codes: string[]): {
    valid: Array<{ code: string; account: Account }>;
    invalid: Array<{ code: string; error: Error }>;
  } {
    const valid: Array<{ code: string; account: Account }> = [];
    const invalid: Array<{ code: string; error: Error }> = [];

    codes.forEach(code => {
      const result = this.get(code);
      if (result.ok) {
        valid.push({ code, account: result.data });
      } else {
        invalid.push({ code, error: result.error });
      }
    });

    return { valid, invalid };
  }

  /** @throws {AccountNotFoundError} @throws {StorageError} */
  async getNote(code: string): Promise<string | null> {
    try {
      const result = this.get(code);
      if (!result.ok) {
        throw result.error;
      }

      return await this.storage.get(code);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw error;
      }
      throw new StorageError('getNote', `Failed to get note for ${code}`, error as Error);
    }
  }

  /** @throws {AccountNotFoundError} @throws {StorageError} */
  async setNote(code: string, note: string): Promise<void> {
    try {
      const result = this.get(code);
      if (!result.ok) {
        throw result.error;
      }

      await this.storage.set(code, note);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw error;
      }
      throw new StorageError('setNote', `Failed to set note for ${code}`, error as Error);
    }
  }

  async deleteNote(code: string): Promise<void> {
    try {
      await this.storage.delete(code);
    } catch (error) {
      throw new StorageError('deleteNote', `Failed to delete note for ${code}`, error as Error);
    }
  }

  async getAllNotes(): Promise<Map<string, string>> {
    try {
      return await this.storage.getAll();
    } catch (error) {
      throw new StorageError('getAllNotes', 'Failed to get all notes', error as Error);
    }
  }

  async clearAllNotes(): Promise<void> {
    try {
      await this.storage.clear();
    } catch (error) {
      throw new StorageError('clearAllNotes', 'Failed to clear all notes', error as Error);
    }
  }

  async hasNote(code: string): Promise<boolean> {
    try {
      const note = await this.getNote(code);
      return note !== null;
    } catch {
      return false;
    }
  }

  export(format: 'json', options?: JsonExportOptions): string;
  export(format: 'csv', options?: CsvExportOptions): string;
  export(
    format: 'json' | 'csv',
    options?: JsonExportOptions | CsvExportOptions
  ): string {
    const accounts = this.registry.getAll();
    switch (format) {
      case 'json':
        return JsonExporter.export(accounts, options as JsonExportOptions);
      case 'csv':
        return CsvExporter.export(accounts, options as CsvExportOptions);
    }
  }

  exportToJSON(options?: JsonExportOptions): string {
    return JsonExporter.export(this.registry.getAll(), options);
  }

  exportToCSV(options?: CsvExportOptions): string {
    return CsvExporter.export(this.registry.getAll(), options);
  }

  exportClass(classCode: string, format: 'json', options?: JsonExportOptions): string;
  exportClass(classCode: string, format: 'csv', options?: CsvExportOptions): string;
  exportClass(
    classCode: string,
    format: 'json' | 'csv',
    options?: JsonExportOptions | CsvExportOptions
  ): string {
    const accounts = this.registry.getByClass(classCode);
    switch (format) {
      case 'json':
        return JsonExporter.export(accounts, options as JsonExportOptions);
      case 'csv':
        return CsvExporter.export(accounts, options as CsvExportOptions);
    }
  }

  /** Get localized account name with fallback to French source name. Returns null if account not found. */
  getLocalizedName(code: string): string | null {
    const account = this.getOrNull(code);
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

  getStats(): RegistryStats {
    return this.registry.getStats();
  }
}

export function createLedgerEngine(
  options?: LedgerEngineOptions
): LedgerEngine {
  return new LedgerEngine(options);
}

let defaultEngine: LedgerEngine | null = null;

export function getDefaultLedgerEngine(): LedgerEngine {
  if (!defaultEngine) {
    defaultEngine = new LedgerEngine();
  }
  return defaultEngine;
}
