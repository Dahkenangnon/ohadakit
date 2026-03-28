import type { Account } from '../core/Account';
import type { AccountRegistry } from '../core/AccountRegistry';
import type { QueryFilter, SearchOptions, SortOptions } from '../core/types';

/**
 * Fluent query builder. Chain filters and call `.execute()` to get results.
 *
 * @example
 * ```typescript
 * ledger.query().inClass('4').atLevel(3).nameContains('client').execute();
 * ```
 */
export class QueryBuilder {
  private registry: AccountRegistry;
  private filters: QueryFilter = {};
  private searchText?: string;
  private searchOpts?: SearchOptions;
  private sortOpts?: SortOptions;
  private limitValue?: number;
  private offsetValue?: number;

  constructor(registry: AccountRegistry) {
    this.registry = registry;
  }

  inClass(classCode: string | string[]): this {
    this.filters.class = classCode;
    return this;
  }

  atLevel(level: number | number[]): this {
    this.filters.level = level;
    return this;
  }

  withParent(parentCode: string): this {
    this.filters.parent = parentCode;
    return this;
  }

  nameContains(text: string): this {
    this.filters.nameContains = text;
    return this;
  }

  codeMatches(pattern: RegExp): this {
    this.filters.codePattern = pattern;
    return this;
  }

  where(predicate: (account: Account) => boolean): this {
    const existingPredicate = this.filters.predicate;

    if (existingPredicate) {
      // Combine predicates with AND logic
      this.filters.predicate = (account) =>
        existingPredicate(account) && predicate(account);
    } else {
      this.filters.predicate = predicate;
    }

    return this;
  }

  search(text: string, options?: SearchOptions): this {
    this.searchText = text;
    this.searchOpts = options;
    return this;
  }

  sortBy(by: 'code' | 'name' | 'level', direction: 'asc' | 'desc' = 'asc'): this {
    this.sortOpts = { by, direction };
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  offset(count: number): this {
    this.offsetValue = count;
    return this;
  }

  execute(): Account[] {
    let results: Account[];

    // Start with search if specified
    if (this.searchText) {
      if (this.searchOpts?.fuzzy) {
        results = this.registry.searchByNameFuzzy(
          this.searchText,
          this.searchOpts.threshold,
          this.searchOpts.limit
        );
      } else {
        results = this.registry.searchByName(this.searchText, {
          limit: this.searchOpts?.limit
        });
      }
    } else {
      // Start with all accounts
      results = this.registry.getAll();
    }

    // Apply filters
    results = this.applyFilters(results);

    // Apply sorting
    if (this.sortOpts) {
      results = this.applySorting(results, this.sortOpts);
    }

    // Apply offset
    if (this.offsetValue !== undefined) {
      results = results.slice(this.offsetValue);
    }

    // Apply limit
    if (this.limitValue !== undefined) {
      results = results.slice(0, this.limitValue);
    }

    return results;
  }

  count(): number {
    const results = this.execute();
    return results.length;
  }

  first(): Account | null {
    const results = this.limit(1).execute();
    return results[0] ?? null;
  }

  exists(): boolean {
    return this.count() > 0;
  }

  private applyFilters(accounts: Account[]): Account[] {
    let filtered = accounts;

    // Filter by class
    if (this.filters.class) {
      const classes = Array.isArray(this.filters.class)
        ? this.filters.class
        : [this.filters.class];
      filtered = filtered.filter(acc => classes.includes(acc.classCode));
    }

    // Filter by level
    if (this.filters.level !== undefined) {
      const levels = Array.isArray(this.filters.level)
        ? this.filters.level
        : [this.filters.level];
      filtered = filtered.filter(acc => levels.includes(acc.level));
    }

    // Filter by parent
    if (this.filters.parent) {
      filtered = filtered.filter(acc => acc.parentCode === this.filters.parent);
    }

    // Filter by name
    if (this.filters.nameContains) {
      const lowerQuery = this.filters.nameContains.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by code pattern
    if (this.filters.codePattern) {
      filtered = filtered.filter(acc =>
        this.filters.codePattern!.test(acc.code)
      );
    }

    // Apply custom predicate
    if (this.filters.predicate) {
      filtered = filtered.filter(this.filters.predicate);
    }

    return filtered;
  }

  private applySorting(accounts: Account[], options: SortOptions): Account[] {
    const sorted = [...accounts];
    const { by, direction } = options;
    const multiplier = direction === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (by) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'level':
          comparison = a.level - b.level;
          break;
      }

      return comparison * multiplier;
    });

    return sorted;
  }
}
