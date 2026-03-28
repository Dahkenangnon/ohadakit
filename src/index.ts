/**
 * OhadaKit SDK - Main entry point
 * Production-ready TypeScript SDK for OHADA/SYSCOHADA accounting chart
 */

// Main SDK classes
export { LedgerEngine, createLedgerEngine, getDefaultLedgerEngine } from './LedgerEngine';
export { AccountBook, createAccountBook } from './AccountBook';
export type { CreateAccountBookOptions } from './AccountBook';

// Core classes
export { Account, isAccount } from './core/Account';
export { AccountRegistry, getDefaultRegistry, resetDefaultRegistry } from './core/AccountRegistry';
export { AccountIndex } from './core/AccountIndex';

// Query engine
export { QueryBuilder } from './query/QueryEngine';

// Storage adapters
export { MemoryStorage } from './storage/MemoryStorage';
export { LocalStorageAdapter } from './storage/LocalStorage';

// Export utilities
export { JsonExporter, CsvExporter } from './export/Exporter';

// Validation
export {
  validateAccountCode,
  validateAccountCodeFormat,
  validateClassCode,
  validateAccountLevel,
  isValidAccountCodeFormat,
  isValidClassCode,
  sanitizeAccountCode,
  getAccountLevelFromCode,
  extractClassCode,
  extractParentCode,
} from './validation/validators';

// Errors
export {
  OhadaKitError,
  AccountNotFoundError,
  InvalidAccountCodeFormatError,
  InvalidAccountLevelError,
  InvalidClassCodeError,
  StorageError,
  ExportError,
} from './validation/errors';

// Types
export type {
  // Core types
  AccountCode,
  ClassCode,
  Result,
  RawAccountData,
  AccountMetadata,
  AccountJSON,
  OhadaClass,
  OhadaLocale,

  // Query types
  QueryFilter,
  SearchOptions,
  SortOptions,

  // Statistics
  RegistryStats,

  // Export types
  ExportFormat,
  JsonStructure,
  JsonExportOptions,
  CsvExportOptions,
  ExportOptions,

  // Storage types
  StorageAdapter,
  LedgerEngineOptions,

  // AccountBook types
  AccountBookOptions,
  AccountBookSnapshot,
  AccountBookStats,
} from './core/types';

// i18n - Internationalization
export { TranslationService } from './i18n/TranslationService';
export { accountTranslations } from './i18n/account-names';
export type { LocalizedString, AccountTranslations, ClassTranslations } from './i18n/types';

// Type helpers
export { Ok, Err, isOk, isErr, isClassCode } from './core/types';

// Data
export { loadOhadaAccounts, getClassMetadata, getAllClassCodes, OHADA_CLASSES } from './data/ohada-accounts';

// Custom Account Management
export { CustomAccountManager } from './custom/CustomAccountManager';
export { CustomAccountValidator } from './custom/CustomAccountValidator';
export { CustomAccountIndex } from './custom/CustomAccountIndex';

// Custom account types
export type {
  CustomAccountInput,
  CustomAccountData,
  LabelOverride,
  CustomAccountStorage,
  CustomAccountManagerOptions,
  CreateAccountResult,
  UpdateLabelResult,
  DeleteAccountResult,
  CustomAccountStats,
} from './custom/types';

export {
  STORAGE_KEYS as CUSTOM_STORAGE_KEYS,
  DEFAULT_STORAGE_PREFIX,
  STORAGE_VERSION,
} from './custom/types';

// Custom account errors
export {
  CustomAccountError,
  CannotModifyMainAccountError,
  CannotCreateMainAccountError,
  ParentAccountNotFoundError,
  AccountCodeConflictError,
  InvalidCustomCodeError,
  CustomStorageError,
} from './custom/errors';
