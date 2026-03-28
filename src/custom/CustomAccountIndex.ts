import type { CustomAccountData } from './types';

/**
 * Dynamic index for custom accounts, supporting add/remove/update mutations.
 * Unlike `AccountIndex` (which is static and immutable after construction),
 * this index is designed for the mutable overlay of user-created accounts.
 */
export class CustomAccountIndex {
  // Primary index: code -> CustomAccountData
  private byCode: Map<string, CustomAccountData>;

  // Secondary indexes
  private byClass: Map<string, Set<string>>;
  private byParent: Map<string, Set<string>>;

  constructor() {
    this.byCode = new Map();
    this.byClass = new Map();
    this.byParent = new Map();
  }

  /**
   * Add a custom account to the index
   */
  add(account: CustomAccountData): void {
    // Primary index
    this.byCode.set(account.code, account);

    // Class index
    if (!this.byClass.has(account.classCode)) {
      this.byClass.set(account.classCode, new Set());
    }
    this.byClass.get(account.classCode)!.add(account.code);

    // Parent index
    if (!this.byParent.has(account.parentCode)) {
      this.byParent.set(account.parentCode, new Set());
    }
    this.byParent.get(account.parentCode)!.add(account.code);
  }

  /**
   * Remove a custom account from the index
   */
  remove(code: string): boolean {
    const account = this.byCode.get(code);
    if (!account) {
      return false;
    }

    // Remove from primary index
    this.byCode.delete(code);

    // Remove from class index
    const classSet = this.byClass.get(account.classCode);
    if (classSet) {
      classSet.delete(code);
      if (classSet.size === 0) {
        this.byClass.delete(account.classCode);
      }
    }

    // Remove from parent index
    const parentSet = this.byParent.get(account.parentCode);
    if (parentSet) {
      parentSet.delete(code);
      if (parentSet.size === 0) {
        this.byParent.delete(account.parentCode);
      }
    }

    return true;
  }

  /**
   * Update a custom account (replaces existing entry)
   */
  update(account: CustomAccountData): void {
    this.remove(account.code);
    this.add(account);
  }

  /**
   * Get a custom account by code
   */
  get(code: string): CustomAccountData | null {
    return this.byCode.get(code) ?? null;
  }

  /**
   * Check if a custom account exists
   */
  has(code: string): boolean {
    return this.byCode.has(code);
  }

  /**
   * Get all custom accounts
   */
  getAll(): CustomAccountData[] {
    return Array.from(this.byCode.values());
  }

  /**
   * Get all custom account codes
   */
  getAllCodes(): string[] {
    return Array.from(this.byCode.keys());
  }

  /**
   * Get custom accounts by class
   */
  getByClass(classCode: string): CustomAccountData[] {
    const codes = this.byClass.get(classCode);
    if (!codes) return [];
    return Array.from(codes)
      .map(code => this.byCode.get(code))
      .filter((acc): acc is CustomAccountData => acc !== undefined);
  }

  /**
   * Get custom accounts by parent
   */
  getByParent(parentCode: string): CustomAccountData[] {
    const codes = this.byParent.get(parentCode);
    if (!codes) return [];
    return Array.from(codes)
      .map(code => this.byCode.get(code))
      .filter((acc): acc is CustomAccountData => acc !== undefined);
  }

  /**
   * Get children codes of a parent (for checking if parent has custom children)
   */
  getChildrenCodes(parentCode: string): string[] {
    const codes = this.byParent.get(parentCode);
    return codes ? Array.from(codes) : [];
  }

  /**
   * Search custom accounts by name (case-insensitive substring match)
   */
  searchByName(query: string): CustomAccountData[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(acc =>
      acc.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search custom accounts by code prefix
   */
  searchByPrefix(prefix: string): CustomAccountData[] {
    return this.getAll().filter(acc => acc.code.startsWith(prefix));
  }

  /**
   * Get total count
   */
  get size(): number {
    return this.byCode.size;
  }

  /**
   * Clear all indexes
   */
  clear(): void {
    this.byCode.clear();
    this.byClass.clear();
    this.byParent.clear();
  }

  /**
   * Rebuild from an array of accounts
   */
  rebuild(accounts: CustomAccountData[]): void {
    this.clear();
    accounts.forEach(acc => this.add(acc));
  }

  /**
   * Get statistics
   */
  getStats(): { total: number; byClass: Record<string, number> } {
    const byClass: Record<string, number> = {};
    this.byClass.forEach((codes, classCode) => {
      byClass[classCode] = codes.size;
    });
    return { total: this.size, byClass };
  }

  /**
   * Convert to Map for direct access
   */
  toMap(): Map<string, CustomAccountData> {
    return new Map(this.byCode);
  }
}
