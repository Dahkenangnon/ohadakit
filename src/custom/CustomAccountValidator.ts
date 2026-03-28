/**
 * Validation logic for custom account operations
 */

import type { AccountRegistry } from '../core/AccountRegistry';
import type { Account } from '../core/Account';
import type { Result } from '../core/types';
import type { CustomAccountInput, CustomAccountData } from './types';
import { Ok, Err } from '../core/types';
import {
  CannotModifyMainAccountError,
  CannotCreateMainAccountError,
  ParentAccountNotFoundError,
  AccountCodeConflictError,
  InvalidCustomCodeError,
} from './errors';

/**
 * Validated input for account creation (with derived fields)
 */
export interface ValidatedAccountInput extends CustomAccountInput {
  level: number;
  classCode: string;
}

/**
 * Validates custom account operations against OHADA business rules:
 * - 2-char main accounts are immutable (no create/modify/delete)
 * - Custom codes must be 3+ chars, alphanumeric + hyphens, starting with parent code
 * - Parent must exist in registry or custom accounts
 * - No duplicate codes allowed
 */
export class CustomAccountValidator {
  constructor(
    private registry: AccountRegistry,
    private customAccounts: Map<string, CustomAccountData>
  ) {}

  /**
   * Update the custom accounts reference (called when customAccounts changes)
   */
  setCustomAccounts(customAccounts: Map<string, CustomAccountData>): void {
    this.customAccounts = customAccounts;
  }

  /**
   * Check if a code is a 2-character main account
   */
  isMainAccount(code: string): boolean {
    return code.length === 2;
  }

  /**
   * Check if an account exists (in registry or custom accounts)
   */
  accountExists(code: string): boolean {
    return this.registry.has(code) || this.customAccounts.has(code);
  }

  /**
   * Get an account by code (from registry or custom accounts)
   */
  getAccount(code: string): Account | CustomAccountData | null {
    const official = this.registry.getByCode(code);
    if (official) return official;

    const custom = this.customAccounts.get(code);
    if (custom) return custom;

    return null;
  }

  /**
   * Validate code format for custom accounts
   *
   * Rules:
   * - Must be 3+ characters
   * - Must start with parent code
   * - Must be alphanumeric + hyphens only
   * - First character must be a digit 1-9
   */
  validateCodeFormat(
    code: string,
    parentCode: string
  ): Result<string, InvalidCustomCodeError> {
    // Must be 3+ characters
    if (code.length < 3) {
      return Err(
        new InvalidCustomCodeError(
          code,
          'Custom account codes must be at least 3 characters long'
        )
      );
    }

    // Must start with parent code
    if (!code.startsWith(parentCode)) {
      return Err(
        new InvalidCustomCodeError(
          code,
          `Code must start with parent code "${parentCode}"`
        )
      );
    }

    // Must be longer than parent code
    if (code.length <= parentCode.length) {
      return Err(
        new InvalidCustomCodeError(
          code,
          `Code must be longer than parent code "${parentCode}"`
        )
      );
    }

    // First character must be a digit 1-9
    if (!/^[1-9]/.test(code)) {
      return Err(
        new InvalidCustomCodeError(
          code,
          'Code must start with a digit 1-9 (the class number)'
        )
      );
    }

    // Must be alphanumeric + hyphens only
    if (!/^[1-9][0-9A-Za-z-]*$/.test(code)) {
      return Err(
        new InvalidCustomCodeError(
          code,
          'Code can only contain digits, letters, and hyphens'
        )
      );
    }

    return Ok(code);
  }

  /**
   * Validate custom account creation
   */
  validateCreate(
    input: CustomAccountInput
  ): Result<ValidatedAccountInput, CannotCreateMainAccountError | ParentAccountNotFoundError | AccountCodeConflictError | InvalidCustomCodeError> {
    const { code, name, parentCode } = input;

    // Cannot create 2-character main accounts
    if (this.isMainAccount(code)) {
      return Err(new CannotCreateMainAccountError(code));
    }

    // Name must not be empty
    if (!name.trim()) {
      return Err(
        new InvalidCustomCodeError(code, 'Account name cannot be empty')
      );
    }

    // Parent must exist
    const parent = this.getAccount(parentCode);
    if (!parent) {
      return Err(new ParentAccountNotFoundError(parentCode));
    }

    // Validate code format
    const formatResult = this.validateCodeFormat(code, parentCode);
    if (!formatResult.ok) {
      return formatResult;
    }

    // Code must not already exist
    if (this.accountExists(code)) {
      return Err(new AccountCodeConflictError(code));
    }

    // Derive level and classCode from parent
    const level = (parent.level ?? 1) + 1;
    const classCode = parent.classCode;

    return Ok({
      code,
      name: name.trim(),
      parentCode,
      level,
      classCode,
    });
  }

  /**
   * Validate label update for an account
   */
  validateLabelUpdate(
    code: string
  ): Result<Account | CustomAccountData, CannotModifyMainAccountError | InvalidCustomCodeError> {
    // Cannot modify 2-character main accounts
    if (this.isMainAccount(code)) {
      return Err(new CannotModifyMainAccountError(code));
    }

    // Account must exist
    const account = this.getAccount(code);
    if (!account) {
      return Err(
        new InvalidCustomCodeError(code, 'Account does not exist')
      );
    }

    return Ok(account);
  }

  /**
   * Validate custom account deletion
   */
  validateDelete(
    code: string,
    customAccounts: Map<string, CustomAccountData>
  ): Result<CustomAccountData, InvalidCustomCodeError> {
    // Must be a custom account (not official)
    const customAccount = customAccounts.get(code);
    if (!customAccount) {
      return Err(
        new InvalidCustomCodeError(
          code,
          'Only custom accounts can be deleted. This account is either official or does not exist.'
        )
      );
    }

    // Check if this account has custom children
    const hasChildren = Array.from(customAccounts.values()).some(
      acc => acc.parentCode === code
    );
    if (hasChildren) {
      return Err(
        new InvalidCustomCodeError(
          code,
          'Cannot delete account with custom child accounts. Delete children first.'
        )
      );
    }

    return Ok(customAccount);
  }
}
