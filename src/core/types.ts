/**
 * Core types and interfaces for the OhadaKit SDK
 */

/**
 * Supported OHADA locales across 17 member countries
 * - fr: French (primary - 13 countries)
 * - en: English (Cameroon bilingual)
 * - pt: Portuguese (Guinea-Bissau)
 * - es: Spanish (Equatorial Guinea)
 */
export type OhadaLocale = 'fr' | 'en' | 'pt' | 'es';

/**
 * Branded type for account codes to prevent mixing with regular strings
 */
export type AccountCode = string & { readonly __brand: 'AccountCode' };

/**
 * Branded type for class codes (1-9)
 */
export type ClassCode = string & { readonly __brand: 'ClassCode' };

/**
 * Result type for operations that can fail
 * Replaces throwing exceptions with explicit error handling
 */
export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * Helper to create success result
 */
export function Ok<T, E = Error>(data: T): Result<T, E> {
  return { ok: true, data };
}

/**
 * Helper to create error result
 */
export function Err<E = Error>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Raw account data structure (from OHADA source)
 */
export interface RawAccountData {
  code: string;
  name: string;
  level: 1 | 2 | 3 | 4;
  classCode: string;
  parentCode?: string;
}

/**
 * Account metadata for additional information
 */
export interface AccountMetadata {
  /** French description */
  description?: string;
  /** English translation of name */
  nameEn?: string;
  /** English description */
  descriptionEn?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Whether this is a commonly used account */
  isCommon?: boolean;
}

/**
 * Serializable account data (for JSON export)
 */
export interface AccountJSON {
  code: string;
  name: string;
  level: number;
  classCode: string;
  parentCode?: string;
  path: string[];
  pathString: string;
  metadata?: AccountMetadata;
}

/**
 * OHADA class information
 */
export interface OhadaClass {
  code: ClassCode;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
}

/**
 * Query filter options for finding accounts
 */
export interface QueryFilter {
  /** Filter by class code (e.g., "1", "4") */
  class?: string | string[];
  /** Filter by hierarchy level (1-4) */
  level?: number | number[];
  /** Filter by parent account code */
  parent?: string;
  /** Filter by name (substring match) */
  nameContains?: string;
  /** Filter by code pattern (regex) */
  codePattern?: RegExp;
  /** Custom predicate function */
  predicate?: (account: any) => boolean; // Using any to avoid circular dependency with Account type
}

/**
 * Search options for text-based searches
 */
export interface SearchOptions {
  /** Enable fuzzy matching */
  fuzzy?: boolean;
  /** Minimum similarity score (0-1) for fuzzy search */
  threshold?: number;
  /** Maximum number of results */
  limit?: number;
  /** Case-sensitive search */
  caseSensitive?: boolean;
  /** Search in specific fields */
  fields?: ('code' | 'name')[];
}

/**
 * Sort options for result ordering
 */
export interface SortOptions {
  /** Field to sort by */
  by: 'code' | 'name' | 'level';
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Statistics about the account registry
 */
export interface RegistryStats {
  /** Total number of accounts */
  total: number;
  /** Count by class */
  byClass: Record<string, number>;
  /** Count by level */
  byLevel: Record<number, number>;
  /** Number of level 2 accounts */
  mainAccounts: number;
  /** Number of level 3 accounts */
  subAccounts: number;
  /** Number of level 4 accounts */
  detailAccounts: number;
}

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv';

/**
 * Export structure for JSON
 */
export type JsonStructure = 'flat' | 'hierarchical';

/**
 * Options for JSON export
 */
export interface JsonExportOptions {
  /** Output structure */
  structure?: JsonStructure;
  /** Pretty print with indentation */
  pretty?: boolean;
  /** Include notes/metadata */
  includeNotes?: boolean;
}

/**
 * Options for CSV export
 */
export interface CsvExportOptions {
  /** Column delimiter */
  delimiter?: string;
  /** Include header row */
  includeHeader?: boolean;
  /** Columns to export */
  columns?: string[];
  /** Include notes column */
  includeNotes?: boolean;
}

/**
 * Union type for all export options
 */
export type ExportOptions = JsonExportOptions | CsvExportOptions;

/**
 * Storage adapter interface for pluggable storage
 */
export interface StorageAdapter {
  /** Get a note for an account */
  get(key: string): Promise<string | null>;
  /** Set a note for an account */
  set(key: string, value: string): Promise<void>;
  /** Delete a note */
  delete(key: string): Promise<void>;
  /** Get all notes */
  getAll(): Promise<Map<string, string>>;
  /** Clear all notes */
  clear(): Promise<void>;
}

/**
 * Options for LedgerEngine initialization
 */
export interface LedgerEngineOptions {
  /** Storage adapter for notes */
  storage?: StorageAdapter;
  /** Locale for internationalization (default: 'fr') */
  locale?: OhadaLocale;
}

/**
 * Check if a value is a valid class code (1-9)
 */
export function isClassCode(value: unknown): value is ClassCode {
  return typeof value === 'string' && /^[1-9]$/.test(value);
}

/**
 * Type guard for Result success
 */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; data: T } {
  return result.ok === true;
}

/**
 * Type guard for Result error
 */
export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return result.ok === false;
}

/**
 * Options for AccountBook initialization
 */
export interface AccountBookOptions {
  /** Storage adapter for notes and custom accounts */
  storage: StorageAdapter;
  /** Locale for internationalization (default: 'fr') */
  locale?: OhadaLocale;
  /** Storage key prefix (default: 'ohadakit:') */
  storagePrefix?: string;
}

/**
 * Serializable snapshot of AccountBook state for backup/restore
 */
export interface AccountBookSnapshot {
  /** Schema version */
  version: number;
  /** ISO timestamp of snapshot creation */
  timestamp: string;
  /** Active locale at snapshot time */
  locale: OhadaLocale;
  /** All custom accounts (inline imports to avoid circular dependency with custom/types) */
  customAccounts: import('../custom/types').CustomAccountData[];
  /** All label overrides */
  labelOverrides: import('../custom/types').LabelOverride[];
  /** All notes keyed by account code */
  notes: Record<string, string>;
}

/**
 * Extended statistics including custom accounts and notes
 */
export interface AccountBookStats extends RegistryStats {
  /** Number of custom accounts */
  customAccountCount: number;
  /** Number of label overrides */
  labelOverrideCount: number;
  /** Number of notes */
  noteCount: number;
}
