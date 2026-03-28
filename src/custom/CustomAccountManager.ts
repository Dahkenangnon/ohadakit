import { Account } from '../core/Account';
import { AccountRegistry, getDefaultRegistry } from '../core/AccountRegistry';
import type { StorageAdapter, RawAccountData } from '../core/types';
import { Ok, Err } from '../core/types';
import { CustomAccountIndex } from './CustomAccountIndex';
import { CustomAccountValidator } from './CustomAccountValidator';
import { CustomStorageError } from './errors';
import type {
  CustomAccountInput,
  CustomAccountData,
  CustomAccountManagerOptions,
  CustomAccountStorage,
  LabelOverride,
  CreateAccountResult,
  UpdateLabelResult,
  DeleteAccountResult,
  CustomAccountStats,
} from './types';
import {
  STORAGE_KEYS,
  DEFAULT_STORAGE_PREFIX,
  STORAGE_VERSION,
} from './types';

/**
 * Overlay on the immutable OHADA AccountRegistry for custom account creation and label modifications.
 *
 * Uses an async initialization pattern: call `initialize()` before any mutating operations.
 * Custom accounts and label overrides are persisted via the provided `StorageAdapter`.
 *
 * Business rules:
 * - Cannot create or modify 2-character main accounts (those are official OHADA accounts)
 * - Can add children (3+ char codes) to any existing account
 * - Can override labels of 3+ char accounts (both official and custom)
 */
export class CustomAccountManager {
  private readonly baseRegistry: AccountRegistry;
  private readonly storage: StorageAdapter;
  private readonly storagePrefix: string;
  private readonly customIndex: CustomAccountIndex;
  private readonly labelOverrides: Map<string, LabelOverride>;
  private readonly validator: CustomAccountValidator;
  private initialized: boolean = false;

  constructor(options: CustomAccountManagerOptions) {
    this.baseRegistry = getDefaultRegistry();
    this.storage = options.storage;
    this.storagePrefix = options.storagePrefix ?? DEFAULT_STORAGE_PREFIX;
    this.customIndex = new CustomAccountIndex();
    this.labelOverrides = new Map();
    this.validator = new CustomAccountValidator(
      this.baseRegistry,
      this.customIndex.toMap()
    );
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.load();
      this.initialized = true;
    } catch (error) {
      throw new CustomStorageError(
        'initialize',
        'Failed to initialize CustomAccountManager',
        error as Error
      );
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * @example
   * ```typescript
   * await manager.createAccount({ code: '411-VIP', name: 'Clients VIP', parentCode: '411' });
   * ```
   */
  async createAccount(input: CustomAccountInput): Promise<CreateAccountResult> {
    this.ensureInitialized();

    // Update validator with current custom accounts
    this.validator.setCustomAccounts(this.customIndex.toMap());

    // Validate input
    const validation = this.validator.validateCreate(input);
    if (!validation.ok) {
      return validation;
    }

    const validatedInput = validation.data;

    // Create custom account data
    const now = new Date().toISOString();
    const accountData: CustomAccountData = {
      code: validatedInput.code,
      name: validatedInput.name,
      level: validatedInput.level,
      classCode: validatedInput.classCode,
      parentCode: validatedInput.parentCode,
      createdAt: now,
      updatedAt: now,
      isCustom: true,
    };

    // Add to index
    this.customIndex.add(accountData);

    // Persist to storage
    await this.save();

    // Create and return Account instance
    const account = this.createAccountInstance(accountData);
    return Ok(account);
  }

  async deleteCustomAccount(code: string): Promise<DeleteAccountResult> {
    this.ensureInitialized();

    // Validate deletion
    const validation = this.validator.validateDelete(code, this.customIndex.toMap());
    if (!validation.ok) {
      return validation;
    }

    // Remove from index
    this.customIndex.remove(code);

    // Also remove any label override for this account
    this.labelOverrides.delete(code);

    // Persist to storage
    await this.save();

    return Ok(undefined);
  }

  /**
   * @example
   * ```typescript
   * await manager.updateLabel('4111', 'Clients - Particuliers');
   * ```
   */
  async updateLabel(code: string, newLabel: string): Promise<UpdateLabelResult> {
    this.ensureInitialized();

    // Validate label update
    this.validator.setCustomAccounts(this.customIndex.toMap());
    const validation = this.validator.validateLabelUpdate(code);
    if (!validation.ok) {
      return validation;
    }

    const originalAccount = validation.data;
    const now = new Date().toISOString();

    // Check if this is a custom account
    const customAccount = this.customIndex.get(code);
    if (customAccount) {
      // Update custom account directly
      const updatedAccount: CustomAccountData = {
        ...customAccount,
        name: newLabel.trim(),
        updatedAt: now,
      };
      this.customIndex.update(updatedAccount);
    } else {
      // Create/update label override for official account
      const override: LabelOverride = {
        code,
        originalName: originalAccount.name,
        customName: newLabel.trim(),
        modifiedAt: now,
      };
      this.labelOverrides.set(code, override);
    }

    // Persist to storage
    await this.save();

    // Return updated account
    const account = this.getByCode(code);
    if (!account) {
      return Err(new Error('Account not found after update'));
    }
    return Ok(account);
  }

  getOriginalLabel(code: string): string | null {
    const override = this.labelOverrides.get(code);
    if (override) {
      return override.originalName;
    }

    const official = this.baseRegistry.getByCode(code);
    if (official) {
      return official.name;
    }

    const custom = this.customIndex.get(code);
    if (custom) {
      return custom.name;
    }

    return null;
  }

  hasLabelOverride(code: string): boolean {
    return this.labelOverrides.has(code);
  }

  getByCode(code: string): Account | null {
    const custom = this.customIndex.get(code);
    if (custom) {
      return this.createAccountInstance(custom);
    }

    const official = this.baseRegistry.getByCode(code);
    if (!official) {
      return null;
    }

    return this.applyLabelOverride(official);
  }

  has(code: string): boolean {
    return this.customIndex.has(code) || this.baseRegistry.has(code);
  }

  getAll(): Account[] {
    const officials = this.baseRegistry.getAll().map(acc => this.applyLabelOverride(acc));
    const customs = this.customIndex.getAll().map(data => this.createAccountInstance(data));
    return [...officials, ...customs];
  }

  getCustomAccounts(): Account[] {
    return this.customIndex.getAll().map(data => this.createAccountInstance(data));
  }

  getCustomAccountData(): CustomAccountData[] {
    return this.customIndex.getAll();
  }

  getLabelOverrides(): LabelOverride[] {
    return Array.from(this.labelOverrides.values());
  }

  getChildren(code: string): Account[] {
    const officials = this.baseRegistry.getChildren(code).map(acc => this.applyLabelOverride(acc));
    const customs = this.customIndex.getByParent(code).map(data => this.createAccountInstance(data));
    return [...officials, ...customs];
  }

  getByClass(classCode: string): Account[] {
    const officials = this.baseRegistry.getByClass(classCode).map(acc => this.applyLabelOverride(acc));
    const customs = this.customIndex.getByClass(classCode).map(data => this.createAccountInstance(data));
    return [...officials, ...customs];
  }

  searchByName(query: string): Account[] {
    const lowerQuery = query.toLowerCase();
    const results: Account[] = [];

    // Search in all accounts (with label overrides applied)
    for (const account of this.getAll()) {
      if (account.name.toLowerCase().includes(lowerQuery)) {
        results.push(account);
      }
    }

    return results;
  }

  searchByPrefix(prefix: string): Account[] {
    const officials = this.baseRegistry.searchByPrefix(prefix).map(acc => this.applyLabelOverride(acc));
    const customs = this.customIndex.searchByPrefix(prefix).map(data => this.createAccountInstance(data));
    return [...officials, ...customs];
  }

  /** @throws {CustomStorageError} if persistence fails */
  async save(): Promise<void> {
    try {
      const data: CustomAccountStorage = {
        version: STORAGE_VERSION,
        accounts: this.customIndex.getAll(),
        labelOverrides: Array.from(this.labelOverrides.values()),
        metadata: {
          lastModified: new Date().toISOString(),
          accountCount: this.customIndex.size,
          overrideCount: this.labelOverrides.size,
        },
      };

      const key = this.getStorageKey(STORAGE_KEYS.CUSTOM_ACCOUNTS);
      await this.storage.set(key, JSON.stringify(data));
    } catch (error) {
      throw new CustomStorageError(
        'save',
        'Failed to save custom accounts to storage',
        error as Error
      );
    }
  }

  /** @throws {CustomStorageError} if reading from storage fails */
  async load(): Promise<void> {
    try {
      const key = this.getStorageKey(STORAGE_KEYS.CUSTOM_ACCOUNTS);
      const stored = await this.storage.get(key);

      if (!stored) {
        // No saved data, start fresh
        return;
      }

      const data = JSON.parse(stored) as CustomAccountStorage;

      // Version mismatch is non-fatal — data loads fine
      // Future migrations can be handled here if schema changes

      // Load accounts
      this.customIndex.rebuild(data.accounts);

      // Load label overrides
      this.labelOverrides.clear();
      for (const override of data.labelOverrides) {
        this.labelOverrides.set(override.code, override);
      }

      // Update validator
      this.validator.setCustomAccounts(this.customIndex.toMap());
    } catch (error) {
      throw new CustomStorageError(
        'load',
        'Failed to load custom accounts from storage',
        error as Error
      );
    }
  }

  async clear(): Promise<void> {
    this.customIndex.clear();
    this.labelOverrides.clear();
    await this.save();
  }

  getStats(): CustomAccountStats {
    const indexStats = this.customIndex.getStats();
    const accounts = this.customIndex.getAll();

    return {
      customAccountCount: indexStats.total,
      labelOverrideCount: this.labelOverrides.size,
      byClass: indexStats.byClass,
      lastModified: accounts.length > 0
        ? accounts.reduce((latest, acc) =>
            acc.updatedAt > latest ? acc.updatedAt : latest,
            accounts[0]!.updatedAt
          )
        : null,
    };
  }

  getTotalCount(): number {
    return this.baseRegistry.size + this.customIndex.size;
  }

  getBaseRegistry(): AccountRegistry {
    return this.baseRegistry;
  }

  getStorage(): StorageAdapter {
    return this.storage;
  }

  private applyLabelOverride(account: Account): Account {
    const override = this.labelOverrides.get(account.code);
    if (override) {
      return this.createAccountWithCustomLabel(account, override.customName);
    }
    return account;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        'CustomAccountManager is not initialized. Call initialize() first.'
      );
    }
  }

  private getStorageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  private createAccountInstance(data: CustomAccountData): Account {
    const rawData: RawAccountData = {
      code: data.code,
      name: data.name,
      level: Math.min(data.level, 4) as 1 | 2 | 3 | 4, // Cap at 4 for type safety
      classCode: data.classCode,
      parentCode: data.parentCode,
    };

    return Account.fromRawData(rawData, {
      isCommon: false,
      tags: ['custom'],
    });
  }

  private createAccountWithCustomLabel(original: Account, customName: string): Account {
    const rawData: RawAccountData = {
      code: original.code,
      name: customName,
      level: original.level,
      classCode: original.classCode,
      parentCode: original.parentCode,
    };

    return Account.fromRawData(rawData, original.metadata);
  }
}
