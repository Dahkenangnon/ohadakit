import { Account } from './Account';
import { AccountIndex } from './AccountIndex';
import type {
  AccountCode,
  RawAccountData,
  RegistryStats,
  OhadaClass
} from './types';
import { loadOhadaAccounts, getClassMetadata } from '../data/ohada-accounts';

/** Central registry for all OHADA accounts with O(1) indexed lookups. */
export class AccountRegistry {
  private accounts: Account[];
  private index: AccountIndex;
  private initialized: boolean = false;

  constructor(accountsData?: RawAccountData[]) {
    // Load accounts from data source or use provided data
    const rawData = accountsData ?? loadOhadaAccounts();

    // Convert raw data to Account instances
    this.accounts = rawData.map(data => Account.fromRawData(data));

    // Create index for fast lookups
    this.index = new AccountIndex(this.accounts);

    // Inject registry reference into all accounts for relationship lookups
    this.accounts.forEach(account => account._setRegistry(this));

    this.initialized = true;
  }

  getByCode(code: string): Account | null {
    return this.index.get(code);
  }

  has(code: string): boolean {
    return this.index.has(code);
  }

  getByClass(classCode: string): Account[] {
    return this.index.getByClass(classCode);
  }

  getByLevel(level: number): Account[] {
    return this.index.getByLevel(level);
  }

  getChildren(code: string | AccountCode): Account[] {
    return this.index.getChildren(code);
  }

  getAll(): Account[] {
    return this.accounts;
  }

  searchByPrefix(prefix: string): Account[] {
    return this.index.searchByPrefix(prefix);
  }

  searchByName(query: string, options?: { limit?: number }): Account[] {
    return this.index.searchByName(query, options);
  }

  searchByNameFuzzy(
    query: string,
    threshold: number = 0.6,
    limit?: number
  ): Account[] {
    return this.index.searchByNameFuzzy(query, threshold, limit);
  }

  getClassMetadata(classCode: string): OhadaClass | null {
    return getClassMetadata(classCode);
  }

  /** Find the level-1 class root account (e.g., "4" for class 4) */
  getClassRoot(classCode: string): Account | null {
    return this.index.getByClass(classCode).find(acc => acc.level === 1) ?? null;
  }

  /** @returns Level-2 accounts for a class, sorted by code (e.g., 41, 42, 43 for class 4) */
  getMainAccounts(classCode: string): Account[] {
    return this.index
      .getByClass(classCode)
      .filter(acc => acc.level === 2)
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  getStats(): RegistryStats {
    const byClass: Record<string, number> = {};
    const byLevel: Record<number, number> = {};

    this.index.getClassCounts().forEach((count, classCode) => {
      byClass[classCode] = count;
    });

    this.index.getLevelCounts().forEach((count, level) => {
      byLevel[level] = count;
    });

    return {
      total: this.accounts.length,
      byClass,
      byLevel,
      mainAccounts: byLevel[2] ?? 0,
      subAccounts: byLevel[3] ?? 0,
      detailAccounts: byLevel[4] ?? 0
    };
  }

  get size(): number {
    return this.accounts.length;
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  getLeafAccounts(): Account[] {
    return this.accounts.filter(acc => acc.isLeaf);
  }

  getRootAccounts(): Account[] {
    return this.accounts.filter(acc => acc.isRoot);
  }

  getByLevelRange(minLevel: number, maxLevel: number): Account[] {
    return this.accounts.filter(
      acc => acc.level >= minLevel && acc.level <= maxLevel
    );
  }

  /** @returns The account and all its descendants via BFS. Empty array if code not found. */
  getSubtree(code: string): Account[] {
    const account = this.getByCode(code);
    if (!account) return [];

    return [account, ...account.getDescendants()];
  }

  getSiblings(code: string): Account[] {
    const account = this.getByCode(code);
    return account?.siblings ?? [];
  }

  getAncestors(code: string): Account[] {
    const account = this.getByCode(code);
    return account?.ancestors ?? [];
  }

  getPath(code: string): Account[] {
    const account = this.getByCode(code);
    return account?.path ?? [];
  }

  /**
   * Validate registry integrity: checks parent existence, class code validity (1-9), and level bounds (1-4).
   * @returns `{ valid: true, errors: [] }` when clean, or `{ valid: false, errors: [...] }` listing each issue
   */
  validateIntegrity(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.accounts.forEach(account => {
      // Check parent exists if parentCode is set
      if (account.parentCode) {
        if (!this.has(account.parentCode)) {
          errors.push(`Account ${account.code} has missing parent ${account.parentCode}`);
        }
      }

      // Check class code is valid (1-9)
      if (!/^[1-9]$/.test(account.classCode)) {
        errors.push(`Account ${account.code} has invalid class code ${account.classCode}`);
      }

      // Check level is valid (1-4)
      if (account.level < 1 || account.level > 4) {
        errors.push(`Account ${account.code} has invalid level ${account.level}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

let defaultRegistry: AccountRegistry | null = null;

export function getDefaultRegistry(): AccountRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new AccountRegistry();
  }
  return defaultRegistry;
}

export function resetDefaultRegistry(): void {
  defaultRegistry = null;
}
