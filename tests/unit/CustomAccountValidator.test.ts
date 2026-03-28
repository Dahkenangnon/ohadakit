/**
 * CustomAccountValidator unit tests
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { CustomAccountValidator } from '../../src/custom/CustomAccountValidator';
import { getDefaultRegistry } from '../../src/core/AccountRegistry';
import {
  CannotModifyMainAccountError,
  CannotCreateMainAccountError,
  ParentAccountNotFoundError,
  AccountCodeConflictError,
  InvalidCustomCodeError,
} from '../../src/custom/errors';
import type { CustomAccountData } from '../../src/custom/types';

describe('CustomAccountValidator', () => {
  let validator: CustomAccountValidator;
  let customAccounts: Map<string, CustomAccountData>;

  beforeEach(() => {
    customAccounts = new Map();
    validator = new CustomAccountValidator(getDefaultRegistry(), customAccounts);
  });

  describe('isMainAccount', () => {
    test('returns true for 2-character codes', () => {
      expect(validator.isMainAccount('10')).toBe(true);
      expect(validator.isMainAccount('41')).toBe(true);
      expect(validator.isMainAccount('99')).toBe(true);
    });

    test('returns false for codes with other lengths', () => {
      expect(validator.isMainAccount('1')).toBe(false);
      expect(validator.isMainAccount('411')).toBe(false);
      expect(validator.isMainAccount('4111')).toBe(false);
      expect(validator.isMainAccount('411A')).toBe(false);
    });
  });

  describe('accountExists', () => {
    test('returns true for official accounts', () => {
      // Note: Level 1 class accounts (e.g., '4') are not stored as individual accounts
      // Only level 2+ accounts are stored
      expect(validator.accountExists('40')).toBe(true);
      expect(validator.accountExists('41')).toBe(true);
      expect(validator.accountExists('411')).toBe(true);
    });

    test('returns true for custom accounts', () => {
      const customAccount: CustomAccountData = {
        code: '411-VIP',
        name: 'Clients VIP',
        level: 4,
        classCode: '4',
        parentCode: '411',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
      };
      customAccounts.set('411-VIP', customAccount);
      validator.setCustomAccounts(customAccounts);

      expect(validator.accountExists('411-VIP')).toBe(true);
    });

    test('returns false for non-existent accounts', () => {
      expect(validator.accountExists('999-FAKE')).toBe(false);
    });
  });

  describe('validateCodeFormat', () => {
    test('accepts valid alphanumeric codes', () => {
      const validCases = [
        { code: '411', parent: '41' },
        { code: '4111', parent: '411' },
        { code: '411A', parent: '411' },
        { code: '411-VIP', parent: '411' },
        { code: '41-SPECIAL', parent: '41' },
        { code: '601MAINT', parent: '601' },
      ];

      validCases.forEach(({ code, parent }) => {
        const result = validator.validateCodeFormat(code, parent);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.data).toBe(code);
        }
      });
    });

    test('rejects codes shorter than 3 characters', () => {
      const result = validator.validateCodeFormat('41', '4');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('at least 3 characters');
      }
    });

    test('rejects codes that do not start with parent code', () => {
      const result = validator.validateCodeFormat('511', '41');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('start with parent code');
      }
    });

    test('rejects codes not longer than parent', () => {
      const result = validator.validateCodeFormat('411', '411');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('longer than parent code');
      }
    });

    test('rejects codes not starting with digit 1-9', () => {
      const result = validator.validateCodeFormat('011', '01');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('digit 1-9');
      }
    });

    test('rejects codes with invalid characters', () => {
      const result = validator.validateCodeFormat('411@VIP', '411');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('digits, letters, and hyphens');
      }
    });
  });

  describe('validateCreate', () => {
    test('accepts valid custom account input', () => {
      const result = validator.validateCreate({
        code: '4111-VIP',
        name: 'Clients VIP',
        parentCode: '4111',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('4111-VIP');
        expect(result.data.name).toBe('Clients VIP');
        expect(result.data.parentCode).toBe('4111');
        expect(result.data.classCode).toBe('4');
        expect(result.data.level).toBeGreaterThanOrEqual(3);
      }
    });

    test('rejects 2-character main account creation', () => {
      const result = validator.validateCreate({
        code: '42',
        name: 'New Main Account',
        parentCode: '4',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(CannotCreateMainAccountError);
      }
    });

    test('rejects empty name', () => {
      const result = validator.validateCreate({
        code: '411-VIP',
        name: '   ',
        parentCode: '411',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('empty');
      }
    });

    test('rejects non-existent parent', () => {
      const result = validator.validateCreate({
        code: '999-VIP',
        name: 'Test',
        parentCode: '999',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ParentAccountNotFoundError);
      }
    });

    test('rejects conflicting code', () => {
      // Account 4111 already exists in OHADA
      const result = validator.validateCreate({
        code: '4111',
        name: 'Duplicate',
        parentCode: '411',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(AccountCodeConflictError);
      }
    });

    test('trims whitespace from name', () => {
      const result = validator.validateCreate({
        code: '411-VIP',
        name: '  Clients VIP  ',
        parentCode: '411',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toBe('Clients VIP');
      }
    });
  });

  describe('validateLabelUpdate', () => {
    test('accepts valid label update for 3+ character account', () => {
      const result = validator.validateLabelUpdate('4111');
      expect(result.ok).toBe(true);
    });

    test('accepts label update for custom account', () => {
      const customAccount: CustomAccountData = {
        code: '411-VIP',
        name: 'Clients VIP',
        level: 4,
        classCode: '4',
        parentCode: '411',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
      };
      customAccounts.set('411-VIP', customAccount);
      validator.setCustomAccounts(customAccounts);

      const result = validator.validateLabelUpdate('411-VIP');
      expect(result.ok).toBe(true);
    });

    test('rejects label update for 2-character main account', () => {
      const result = validator.validateLabelUpdate('41');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(CannotModifyMainAccountError);
      }
    });

    test('rejects label update for non-existent account', () => {
      const result = validator.validateLabelUpdate('999-FAKE');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
      }
    });
  });

  describe('validateDelete', () => {
    test('accepts deletion of custom account', () => {
      const customAccount: CustomAccountData = {
        code: '411-VIP',
        name: 'Clients VIP',
        level: 4,
        classCode: '4',
        parentCode: '411',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
      };
      customAccounts.set('411-VIP', customAccount);

      const result = validator.validateDelete('411-VIP', customAccounts);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('411-VIP');
      }
    });

    test('rejects deletion of official account', () => {
      const result = validator.validateDelete('4111', customAccounts);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('Only custom accounts');
      }
    });

    test('rejects deletion of account with custom children', () => {
      const parentAccount: CustomAccountData = {
        code: '411-PARENT',
        name: 'Parent Account',
        level: 4,
        classCode: '4',
        parentCode: '411',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
      };
      const childAccount: CustomAccountData = {
        code: '411-PARENT-CHILD',
        name: 'Child Account',
        level: 5,
        classCode: '4',
        parentCode: '411-PARENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
      };
      customAccounts.set('411-PARENT', parentAccount);
      customAccounts.set('411-PARENT-CHILD', childAccount);

      const result = validator.validateDelete('411-PARENT', customAccounts);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
        expect(result.error.reason).toContain('child accounts');
      }
    });
  });
});
