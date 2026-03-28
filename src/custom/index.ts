/**
 * Custom Account Management Module
 *
 * Provides the ability to extend the official OHADA chart with custom accounts
 * and modify labels of existing accounts.
 */

// Main manager class
export { CustomAccountManager } from './CustomAccountManager';

// Validator
export { CustomAccountValidator } from './CustomAccountValidator';
export type { ValidatedAccountInput } from './CustomAccountValidator';

// Index
export { CustomAccountIndex } from './CustomAccountIndex';

// Types
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
} from './types';

export {
  STORAGE_KEYS,
  DEFAULT_STORAGE_PREFIX,
  STORAGE_VERSION,
} from './types';

// Errors
export {
  CustomAccountError,
  CannotModifyMainAccountError,
  CannotCreateMainAccountError,
  ParentAccountNotFoundError,
  AccountCodeConflictError,
  InvalidCustomCodeError,
  CustomStorageError,
} from './errors';
