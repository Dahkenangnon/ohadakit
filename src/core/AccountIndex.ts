import type { Account } from './Account';
import type { AccountCode, ClassCode } from './types';

/**
 * Node in a prefix Trie. Each node stores the set of accounts whose code
 * passes through this prefix, enabling O(k) prefix lookups where k is prefix length.
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  accounts: Set<Account> = new Set();
  isEnd: boolean = false;
}

/**
 * Trie (prefix tree) indexed by account code characters.
 * Inserting account "4111" creates nodes for "4", "41", "411", "4111",
 * with each intermediate node accumulating the account in its `accounts` set.
 * This allows `searchByPrefix("41")` to return all accounts starting with "41" in O(k) time.
 */
class AccountTrie {
  private root: TrieNode = new TrieNode();

  insert(account: Account): void {
    let node = this.root;
    const code = account.code;

    for (const char of code) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      node.accounts.add(account);
    }
    node.isEnd = true;
  }

  searchByPrefix(prefix: string): Account[] {
    let node = this.root;

    // Navigate to the prefix node
    for (const char of prefix) {
      const next = node.children.get(char);
      if (!next) {
        return []; // Prefix not found
      }
      node = next;
    }

    // Return all accounts under this prefix
    return Array.from(node.accounts);
  }

  has(code: string): boolean {
    let node = this.root;

    for (const char of code) {
      const next = node.children.get(char);
      if (!next) {
        return false;
      }
      node = next;
    }

    return node.isEnd;
  }
}

export class AccountIndex {
  // Primary index: code -> Account
  private byCode: Map<AccountCode, Account>;

  // Secondary indexes for filtering
  private byClass: Map<ClassCode, Set<Account>>;
  private byLevel: Map<number, Set<Account>>;
  private byParent: Map<AccountCode, Set<Account>>;

  // Trie for prefix-based code search
  private codeTrie: AccountTrie;

  // Name index for text search (lowercase for case-insensitive)
  private nameIndex: Map<string, Set<Account>>;

  constructor(accounts: Account[] = []) {
    this.byCode = new Map();
    this.byClass = new Map();
    this.byLevel = new Map();
    this.byParent = new Map();
    this.codeTrie = new AccountTrie();
    this.nameIndex = new Map();

    // Build all indexes
    accounts.forEach(account => this.addAccount(account));
  }

  private addAccount(account: Account): void {
    // Primary index
    this.byCode.set(account.code, account);

    // Class index
    if (!this.byClass.has(account.classCode)) {
      this.byClass.set(account.classCode, new Set());
    }
    this.byClass.get(account.classCode)!.add(account);

    // Level index
    if (!this.byLevel.has(account.level)) {
      this.byLevel.set(account.level, new Set());
    }
    this.byLevel.get(account.level)!.add(account);

    // Parent index
    if (account.parentCode) {
      if (!this.byParent.has(account.parentCode)) {
        this.byParent.set(account.parentCode, new Set());
      }
      this.byParent.get(account.parentCode)!.add(account);
    }

    // Code trie
    this.codeTrie.insert(account);

    // Name index (tokenized by words)
    this.indexAccountName(account);
  }

  private indexAccountName(account: Account): void {
    const words = account.name.toLowerCase().split(/\s+/);

    words.forEach(word => {
      if (word.length > 0) {
        if (!this.nameIndex.has(word)) {
          this.nameIndex.set(word, new Set());
        }
        this.nameIndex.get(word)!.add(account);
      }
    });
  }

  get(code: string): Account | null {
    return this.byCode.get(code as AccountCode) ?? null;
  }

  has(code: string): boolean {
    return this.byCode.has(code as AccountCode);
  }

  getByClass(classCode: string): Account[] {
    const accounts = this.byClass.get(classCode as ClassCode);
    return accounts ? Array.from(accounts) : [];
  }

  getByLevel(level: number): Account[] {
    const accounts = this.byLevel.get(level);
    return accounts ? Array.from(accounts) : [];
  }

  getChildren(code: string): Account[] {
    const children = this.byParent.get(code as AccountCode);
    return children ? Array.from(children) : [];
  }

  getAll(): Account[] {
    return Array.from(this.byCode.values());
  }

  searchByPrefix(prefix: string): Account[] {
    return this.codeTrie.searchByPrefix(prefix);
  }

  searchByName(query: string, options: { limit?: number } = {}): Account[] {
    const lowerQuery = query.toLowerCase();
    const matches = new Set<Account>();

    // Word index search (fast path)
    const words = lowerQuery.split(/\s+/);
    words.forEach(word => {
      const wordMatches = this.nameIndex.get(word);
      if (wordMatches) {
        wordMatches.forEach(acc => matches.add(acc));
      }
    });

    // Substring fallback only if word index missed (handles partial word matches)
    if (matches.size === 0) {
      this.byCode.forEach(account => {
        if (account.name.toLowerCase().includes(lowerQuery)) {
          matches.add(account);
        }
      });
    }

    const results = Array.from(matches);
    return options.limit ? results.slice(0, options.limit) : results;
  }

  /**
   * Fuzzy name search using Levenshtein-based similarity scoring.
   * @param query - Search term (compared case-insensitively against each account name)
   * @param threshold - Minimum similarity score (0–1). 1.0 = exact substring, 0.6 = tolerant of typos.
   * @param limit - Maximum number of results to return (sorted by descending score)
   * @returns Accounts whose name similarity to `query` meets the threshold
   */
  searchByNameFuzzy(query: string, threshold: number = 0.6, limit?: number): Account[] {
    const lowerQuery = query.toLowerCase();
    const scored: Array<{ account: Account; score: number }> = [];

    // Pre-filter: build set of query characters for cheap overlap check
    const queryChars = new Set(lowerQuery);

    this.byCode.forEach(account => {
      const lowerName = account.name.toLowerCase();

      // Quick reject: skip expensive Levenshtein if no characters overlap
      let overlap = false;
      for (const char of lowerName) {
        if (queryChars.has(char)) { overlap = true; break; }
      }
      if (!overlap) return;

      const score = this.fuzzyMatch(lowerQuery, lowerName);
      if (score >= threshold) {
        scored.push({ account, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    const results = limit ? scored.slice(0, limit) : scored;
    return results.map(item => item.account);
  }

  private fuzzyMatch(query: string, target: string): number {
    if (target.includes(query)) {
      return 1.0; // Exact substring match
    }

    // Calculate Levenshtein distance
    const distance = this.levenshteinDistance(query, target);
    const maxLength = Math.max(query.length, target.length);

    // Convert distance to similarity score (0-1)
    return 1 - distance / maxLength;
  }

  /**
   * Classic Levenshtein edit distance via O(n*m) dynamic programming.
   * Returns the minimum number of single-character edits (insertions,
   * deletions, substitutions) to transform str1 into str2.
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create distance matrix
    const matrix: number[][] = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(0));

    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i]![0] = i;
    for (let j = 0; j <= len2; j++) matrix[0]![j] = j;

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1, // deletion
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j - 1]! + cost // substitution
        );
      }
    }

    return matrix[len1]![len2]!;
  }

  get size(): number {
    return this.byCode.size;
  }

  getClassCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    this.byClass.forEach((accounts, classCode) => {
      counts.set(classCode, accounts.size);
    });
    return counts;
  }

  getLevelCounts(): Map<number, number> {
    const counts = new Map<number, number>();
    this.byLevel.forEach((accounts, level) => {
      counts.set(level, accounts.size);
    });
    return counts;
  }

  clear(): void {
    this.byCode.clear();
    this.byClass.clear();
    this.byLevel.clear();
    this.byParent.clear();
    this.codeTrie = new AccountTrie();
    this.nameIndex.clear();
  }

  rebuild(accounts: Account[]): void {
    this.clear();
    accounts.forEach(account => this.addAccount(account));
  }
}
