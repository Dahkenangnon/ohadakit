import type {
  AccountCode,
  RawAccountData,
  AccountJSON,
  AccountMetadata,
  ClassCode
} from './types';

/**
 * Immutable Account with lazy-computed relationship properties.
 *
 * @example
 * ```typescript
 * const account = ledger.getOrThrow('411');
 * account.parent?.code;    // "41"
 * account.children.length; // child count
 * account.pathString;      // "4 > 41 > 411"
 * ```
 */
export class Account {
  readonly code: AccountCode;
  readonly name: string;
  /** Hierarchy level: 1 (class), 2 (main), 3 (sub), 4 (detail) */
  readonly level: 1 | 2 | 3 | 4;
  readonly classCode: ClassCode;
  readonly parentCode?: AccountCode;
  readonly metadata?: AccountMetadata;

  private _registry?: AccountRegistry;
  private _parent?: Account | null;
  private _children?: Account[];
  private _ancestors?: Account[];
  private _siblings?: Account[];
  private _path?: Account[];
  private _pathString?: string;
  private _pathCodes?: string[];

  constructor(data: RawAccountData, metadata?: AccountMetadata) {
    this.code = data.code as AccountCode;
    this.name = data.name;
    this.level = data.level;
    this.classCode = data.classCode as ClassCode;
    this.parentCode = data.parentCode as AccountCode | undefined;
    this.metadata = metadata;
  }

  _setRegistry(registry: AccountRegistry): void {
    this._registry = registry;
  }

  get parent(): Account | null {
    if (this._parent === undefined) {
      if (!this.parentCode || !this._registry) {
        this._parent = null;
      } else {
        this._parent = this._registry.getByCode(this.parentCode) ?? null;
      }
    }
    return this._parent;
  }

  get children(): Account[] {
    if (this._children === undefined) {
      this._children = this._registry?.getChildren(this.code) ?? [];
    }
    return this._children;
  }

  get ancestors(): Account[] {
    if (this._ancestors === undefined) {
      this._ancestors = [];
      let current = this.parent;
      while (current !== null) {
        this._ancestors.push(current);
        current = current.parent;
      }
    }
    return this._ancestors;
  }

  get siblings(): Account[] {
    if (this._siblings === undefined) {
      if (!this.parent) {
        // Top-level accounts: siblings are other top-level accounts in same class
        this._siblings = this._registry?.getByLevel(this.level).filter(
          acc => acc.classCode === this.classCode && acc.code !== this.code
        ) ?? [];
      } else {
        // Regular accounts: siblings are other children of same parent
        this._siblings = this.parent.children.filter(
          acc => acc.code !== this.code
        );
      }
    }
    return this._siblings;
  }

  get path(): Account[] {
    if (this._path === undefined) {
      this._path = [...this.ancestors].reverse().concat(this);
    }
    return this._path;
  }

  get pathString(): string {
    if (this._pathString === undefined) {
      this._pathString = this.path.map(acc => acc.code).join(' > ');
    }
    return this._pathString;
  }

  get pathCodes(): string[] {
    if (this._pathCodes === undefined) {
      this._pathCodes = this.path.map(acc => acc.code);
    }
    return this._pathCodes;
  }

  get classAccount(): Account | null {
    return this.ancestors[this.ancestors.length - 1] ?? null;
  }

  get isLeaf(): boolean {
    return this.children.length === 0;
  }

  get isRoot(): boolean {
    return this.parentCode === undefined;
  }

  isDescendantOf(code: string): boolean {
    return this.ancestors.some(acc => acc.code === code);
  }

  isAncestorOf(code: string): boolean {
    const other = this._registry?.getByCode(code as AccountCode);
    return other ? other.isDescendantOf(this.code) : false;
  }

  isSiblingOf(code: string): boolean {
    return this.siblings.some(acc => acc.code === code);
  }

  get depth(): number {
    return this.ancestors.length;
  }

  getDescendants(): Account[] {
    const descendants: Account[] = [];
    const queue = [...this.children];

    while (queue.length > 0) {
      const current = queue.shift()!;
      descendants.push(current);
      queue.push(...current.children);
    }

    return descendants;
  }

  /**
   * Get descendants at a specific relative level
   * @param relativeLevel - Levels below this account (1 = direct children, 2 = grandchildren, etc.)
   */
  getDescendantsAtLevel(relativeLevel: number): Account[] {
    return this.getDescendants().filter(
      acc => acc.depth - this.depth === relativeLevel
    );
  }

  toJSON(): AccountJSON {
    return {
      code: this.code,
      name: this.name,
      level: this.level,
      classCode: this.classCode,
      parentCode: this.parentCode,
      path: this.pathCodes,
      pathString: this.pathString,
      metadata: this.metadata
    };
  }

  toRawData(): RawAccountData {
    return {
      code: this.code,
      name: this.name,
      level: this.level,
      classCode: this.classCode,
      parentCode: this.parentCode
    };
  }

  toString(): string {
    return `${this.code} - ${this.name}`;
  }

  toDetailedString(): string {
    return `${this.pathString}: ${this.name}`;
  }

  static fromRawData(data: RawAccountData, metadata?: AccountMetadata): Account {
    return new Account(data, metadata);
  }

  static fromJSON(json: AccountJSON): Account {
    return new Account({
      code: json.code,
      name: json.name,
      level: json.level as 1 | 2 | 3 | 4,
      classCode: json.classCode,
      parentCode: json.parentCode
    }, json.metadata);
  }
}

export function isAccount(value: unknown): value is Account {
  return value instanceof Account;
}

// Avoids circular dependency — actual implementation in AccountRegistry.ts
interface AccountRegistry {
  getByCode(code: AccountCode): Account | null;
  getChildren(code: AccountCode): Account[];
  getByLevel(level: number): Account[];
}
