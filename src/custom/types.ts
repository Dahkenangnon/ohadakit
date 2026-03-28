/**
 * Type definitions for Custom Account Management
 */

import type { StorageAdapter, Result } from '../core/types';
import type { Account } from '../core/Account';

/**
 * Input for creating a custom account
 */
export interface CustomAccountInput {
  /**
   * User-provided code (3+ characters, alphanumeric + hyphens)
   * Must start with parent code
   * Examples: "411A", "4111-VIP", "601MAINT"
   */
  code: string;

  /**
   * Account name/label
   */
  name: string;

  /**
   * Parent account code (must exist in registry or custom accounts)
   */
  parentCode: string;
}

/**
 * Persisted custom account data
 */
export interface CustomAccountData {
  /** Account code (alphanumeric, 3+ characters) */
  code: string;

  /** Account name/label */
  name: string;

  /** Hierarchy level (determined by parent) */
  level: number;

  /** Class code (derived from parent) */
  classCode: string;

  /** Parent account code */
  parentCode: string;

  /** ISO timestamp of creation */
  createdAt: string;

  /** ISO timestamp of last update */
  updatedAt: string;

  /** Marker flag for custom accounts */
  isCustom: true;
}

/**
 * Label override for existing accounts (official or custom)
 */
export interface LabelOverride {
  /** Account code (3+ characters) */
  code: string;

  /** Original name (for reference) */
  originalName: string;

  /** User's custom label */
  customName: string;

  /** ISO timestamp of modification */
  modifiedAt: string;
}

/**
 * Storage schema for persistence
 */
export interface CustomAccountStorage {
  /** Schema version for migrations */
  version: 1;

  /** Custom accounts created by the user */
  accounts: CustomAccountData[];

  /** Label overrides for existing accounts */
  labelOverrides: LabelOverride[];

  /** Metadata about the storage */
  metadata: {
    lastModified: string;
    accountCount: number;
    overrideCount: number;
  };
}

/**
 * Options for CustomAccountManager initialization
 */
export interface CustomAccountManagerOptions {
  /**
   * Storage adapter for persistence (required)
   */
  storage: StorageAdapter;

  /**
   * Custom storage key prefix (default: "ohadakit:")
   */
  storagePrefix?: string;
}

/**
 * Result type for custom account creation
 */
export type CreateAccountResult = Result<Account>;

/**
 * Result type for label update
 */
export type UpdateLabelResult = Result<Account>;

/**
 * Result type for account deletion
 */
export type DeleteAccountResult = Result<void>;

/**
 * Statistics about custom accounts
 */
export interface CustomAccountStats {
  /** Total number of custom accounts */
  customAccountCount: number;

  /** Total number of label overrides */
  labelOverrideCount: number;

  /** Custom accounts by class */
  byClass: Record<string, number>;

  /** Last modification timestamp */
  lastModified: string | null;
}

/**
 * Storage keys used by CustomAccountManager
 */
export const STORAGE_KEYS = {
  /** Main storage key for all custom account data */
  CUSTOM_ACCOUNTS: 'custom:accounts',
} as const;

/**
 * Default storage prefix
 */
export const DEFAULT_STORAGE_PREFIX = 'ohadakit:';

/**
 * Current storage schema version
 */
export const STORAGE_VERSION = 1;
