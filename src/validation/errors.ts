/**
 * Typed error classes for validation failures
 */

/**
 * Base class for all OhadaKit errors
 */
export abstract class OhadaKitError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintain proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message
    };
  }
}

/**
 * Account not found error
 */
export class AccountNotFoundError extends OhadaKitError {
  readonly code = 'ACCOUNT_NOT_FOUND';
  readonly accountCode: string;

  constructor(accountCode: string) {
    super(`Account with code "${accountCode}" not found in OHADA registry`);
    this.accountCode = accountCode;
  }
}

/**
 * Invalid account code format error
 */
export class InvalidAccountCodeFormatError extends OhadaKitError {
  readonly code = 'INVALID_ACCOUNT_CODE_FORMAT';
  readonly accountCode: string;
  readonly reason: string;

  constructor(accountCode: string, reason: string) {
    super(`Invalid account code format "${accountCode}": ${reason}`);
    this.accountCode = accountCode;
    this.reason = reason;
  }
}

/**
 * Invalid account level error
 */
export class InvalidAccountLevelError extends OhadaKitError {
  readonly code = 'INVALID_ACCOUNT_LEVEL';
  readonly level: number;

  constructor(level: number) {
    super(`Invalid account level ${level}. Must be between 1 and 4`);
    this.level = level;
  }
}

/**
 * Invalid class code error
 */
export class InvalidClassCodeError extends OhadaKitError {
  readonly code = 'INVALID_CLASS_CODE';
  readonly classCode: string;

  constructor(classCode: string) {
    super(`Invalid class code "${classCode}". Must be between 1 and 9`);
    this.classCode = classCode;
  }
}

/**
 * Storage operation error
 */
export class StorageError extends OhadaKitError {
  readonly code = 'STORAGE_ERROR';
  readonly operation: string;
  readonly originalError?: Error;

  constructor(operation: string, message: string, originalError?: Error) {
    super(`Storage ${operation} failed: ${message}`);
    this.operation = operation;
    this.originalError = originalError;
  }
}

/**
 * Export operation error
 */
export class ExportError extends OhadaKitError {
  readonly code = 'EXPORT_ERROR';
  readonly format: string;
  readonly originalError?: Error;

  constructor(format: string, message: string, originalError?: Error) {
    super(`Export to ${format} failed: ${message}`);
    this.format = format;
    this.originalError = originalError;
  }
}
