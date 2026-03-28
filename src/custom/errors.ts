/**
 * Error classes for Custom Account Management
 */

import { OhadaKitError } from '../validation/errors';

/**
 * Base class for custom account errors
 */
export abstract class CustomAccountError extends OhadaKitError {
  abstract readonly code: string;
}

/**
 * Cannot modify a 2-character main account
 */
export class CannotModifyMainAccountError extends CustomAccountError {
  readonly code = 'CANNOT_MODIFY_MAIN_ACCOUNT';
  readonly accountCode: string;

  constructor(accountCode: string) {
    super(
      `Cannot modify 2-character main account "${accountCode}". ` +
        `Only accounts with 3+ characters can be modified.`
    );
    this.accountCode = accountCode;
  }
}

/**
 * Cannot create a 2-character main account
 */
export class CannotCreateMainAccountError extends CustomAccountError {
  readonly code = 'CANNOT_CREATE_MAIN_ACCOUNT';
  readonly accountCode: string;

  constructor(accountCode: string) {
    super(
      `Cannot create 2-character main account "${accountCode}". ` +
        `Only accounts with 3+ characters can be created.`
    );
    this.accountCode = accountCode;
  }
}

/**
 * Parent account not found
 */
export class ParentAccountNotFoundError extends CustomAccountError {
  readonly code = 'PARENT_ACCOUNT_NOT_FOUND';
  readonly parentCode: string;

  constructor(parentCode: string) {
    super(
      `Parent account "${parentCode}" does not exist. ` +
        `The parent must be an existing official or custom account.`
    );
    this.parentCode = parentCode;
  }
}

/**
 * Account code already exists
 */
export class AccountCodeConflictError extends CustomAccountError {
  readonly code = 'ACCOUNT_CODE_CONFLICT';
  readonly accountCode: string;

  constructor(accountCode: string) {
    super(
      `Account code "${accountCode}" already exists. ` +
        `Please choose a different code.`
    );
    this.accountCode = accountCode;
  }
}

/**
 * Invalid custom account code format
 */
export class InvalidCustomCodeError extends CustomAccountError {
  readonly code = 'INVALID_CUSTOM_CODE';
  readonly accountCode: string;
  readonly reason: string;

  constructor(accountCode: string, reason: string) {
    super(`Invalid custom account code "${accountCode}": ${reason}`);
    this.accountCode = accountCode;
    this.reason = reason;
  }
}

/**
 * Custom account storage error
 */
export class CustomStorageError extends CustomAccountError {
  readonly code = 'CUSTOM_STORAGE_ERROR';
  readonly operation: string;
  readonly originalError?: Error;

  constructor(operation: string, message: string, originalError?: Error) {
    super(`Custom account storage ${operation} failed: ${message}`);
    this.operation = operation;
    this.originalError = originalError;
  }
}
