/**
 * Validation functions for account codes and queries
 */

import type { Result } from '../core/types';
import { Ok, Err } from '../core/types';
import type { Account } from '../core/Account';
import type { AccountRegistry } from '../core/AccountRegistry';
import {
  InvalidAccountCodeFormatError,
  InvalidAccountLevelError,
  InvalidClassCodeError,
  AccountNotFoundError,
} from './errors';

/**
 * Validate account code format
 * OHADA codes follow pattern: [1-9][0-9]{0,3}
 * - Class level (1): 1-9
 * - Level 2: 10-99
 * - Level 3: 100-999
 * - Level 4: 1000-9999
 */
export function validateAccountCodeFormat(code: string): Result<string> {
  // Empty check
  if (!code || code.trim().length === 0) {
    return Err(
      new InvalidAccountCodeFormatError(code, 'Account code cannot be empty')
    );
  }

  // Remove whitespace
  const trimmedCode = code.trim();

  // Check if it contains only digits
  if (!/^\d+$/.test(trimmedCode)) {
    return Err(
      new InvalidAccountCodeFormatError(
        code,
        'Account code must contain only digits'
      )
    );
  }

  // Check length (1-4 digits)
  if (trimmedCode.length < 1 || trimmedCode.length > 4) {
    return Err(
      new InvalidAccountCodeFormatError(
        code,
        'Account code must be 1-4 digits long'
      )
    );
  }

  // Check first digit is 1-9 (not 0)
  if (trimmedCode[0] === '0') {
    return Err(
      new InvalidAccountCodeFormatError(
        code,
        'Account code must start with digit 1-9, not 0'
      )
    );
  }

  return Ok(trimmedCode);
}

/**
 * Validate class code (must be 1-9)
 */
export function validateClassCode(code: string): Result<string> {
  if (!/^[1-9]$/.test(code)) {
    return Err(new InvalidClassCodeError(code));
  }
  return Ok(code);
}

/**
 * Validate account level (must be 1-4)
 */
export function validateAccountLevel(level: number): Result<number> {
  if (level < 1 || level > 4 || !Number.isInteger(level)) {
    return Err(new InvalidAccountLevelError(level));
  }
  return Ok(level);
}

/**
 * Validate account code against registry
 * Checks both format and existence
 */
export function validateAccountCode(
  code: string,
  registry: AccountRegistry
): Result<Account> {
  // First validate format
  const formatResult = validateAccountCodeFormat(code);
  if (!formatResult.ok) {
    return formatResult;
  }

  const validCode = formatResult.data;

  // Then check if account exists
  const account = registry.getByCode(validCode);
  if (!account) {
    return Err(new AccountNotFoundError(validCode));
  }

  return Ok(account);
}

/**
 * Check if a string is a valid account code format (no registry check)
 */
export function isValidAccountCodeFormat(code: string): boolean {
  const result = validateAccountCodeFormat(code);
  return result.ok;
}

/**
 * Check if a string is a valid class code
 */
export function isValidClassCode(code: string): boolean {
  const result = validateClassCode(code);
  return result.ok;
}

/**
 * Sanitize account code by trimming and removing invalid characters
 */
export function sanitizeAccountCode(code: string): string {
  return code.trim().replace(/\D/g, '');
}

/**
 * Parse account code level from its length
 * - 1 digit: level 1 (class)
 * - 2 digits: level 2
 * - 3 digits: level 3
 * - 4 digits: level 4
 */
export function getAccountLevelFromCode(code: string): number {
  const sanitized = sanitizeAccountCode(code);
  return sanitized.length;
}

/**
 * Extract class code from account code (first digit)
 */
export function extractClassCode(code: string): string {
  const sanitized = sanitizeAccountCode(code);
  return sanitized[0] ?? '';
}

/**
 * Extract parent code from account code
 * Example: "4111" -> "411", "411" -> "41", "41" -> "4"
 */
export function extractParentCode(code: string): string | null {
  const sanitized = sanitizeAccountCode(code);
  if (sanitized.length <= 1) {
    return null; // Class level has no parent
  }
  return sanitized.slice(0, -1);
}

