/**
 * Validation unit tests
 */

import {
  validateAccountCodeFormat,
  validateClassCode,
  validateAccountLevel,
  isValidAccountCodeFormat,
  isValidClassCode,
  sanitizeAccountCode,
  getAccountLevelFromCode,
  extractClassCode,
  extractParentCode,
} from '../../src/validation/validators';
import {
  InvalidAccountCodeFormatError,
  InvalidClassCodeError,
  InvalidAccountLevelError
} from '../../src/validation/errors';

describe('Validators', () => {
  describe('validateAccountCodeFormat', () => {
    test('accepts valid codes', () => {
      const validCodes = ['1', '10', '101', '1011', '4111', '9999'];

      validCodes.forEach(code => {
        const result = validateAccountCodeFormat(code);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.data).toBe(code);
        }
      });
    });

    test('rejects empty code', () => {
      const result = validateAccountCodeFormat('');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidAccountCodeFormatError);
      }
    });

    test('rejects code with non-digits', () => {
      const invalidCodes = ['abc', '41a1', '4-11', '411.1'];

      invalidCodes.forEach(code => {
        const result = validateAccountCodeFormat(code);
        expect(result.ok).toBe(false);
      });
    });

    test('rejects code too long', () => {
      const result = validateAccountCodeFormat('12345');
      expect(result.ok).toBe(false);
    });

    test('rejects code starting with 0', () => {
      const result = validateAccountCodeFormat('0123');
      expect(result.ok).toBe(false);
    });

    test('trims whitespace', () => {
      const result = validateAccountCodeFormat('  4111  ');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe('4111');
      }
    });
  });

  describe('validateClassCode', () => {
    test('accepts valid class codes', () => {
      for (let i = 1; i <= 9; i++) {
        const result = validateClassCode(String(i));
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.data).toBe(String(i));
        }
      }
    });

    test('rejects invalid class codes', () => {
      const invalidCodes = ['0', '10', 'a', ''];

      invalidCodes.forEach(code => {
        const result = validateClassCode(code);
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toBeInstanceOf(InvalidClassCodeError);
        }
      });
    });
  });

  describe('validateAccountLevel', () => {
    test('accepts valid levels', () => {
      [1, 2, 3, 4].forEach(level => {
        const result = validateAccountLevel(level);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.data).toBe(level);
        }
      });
    });

    test('rejects invalid levels', () => {
      [0, 5, -1, 10, 1.5].forEach(level => {
        const result = validateAccountLevel(level);
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toBeInstanceOf(InvalidAccountLevelError);
        }
      });
    });
  });

  describe('isValidAccountCodeFormat', () => {
    test('returns true for valid codes', () => {
      expect(isValidAccountCodeFormat('1')).toBe(true);
      expect(isValidAccountCodeFormat('41')).toBe(true);
      expect(isValidAccountCodeFormat('411')).toBe(true);
      expect(isValidAccountCodeFormat('4111')).toBe(true);
    });

    test('returns false for invalid codes', () => {
      expect(isValidAccountCodeFormat('')).toBe(false);
      expect(isValidAccountCodeFormat('0')).toBe(false);
      expect(isValidAccountCodeFormat('abc')).toBe(false);
      expect(isValidAccountCodeFormat('12345')).toBe(false);
    });
  });

  describe('isValidClassCode', () => {
    test('returns true for valid class codes', () => {
      for (let i = 1; i <= 9; i++) {
        expect(isValidClassCode(String(i))).toBe(true);
      }
    });

    test('returns false for invalid class codes', () => {
      expect(isValidClassCode('0')).toBe(false);
      expect(isValidClassCode('10')).toBe(false);
      expect(isValidClassCode('a')).toBe(false);
    });
  });

  describe('sanitizeAccountCode', () => {
    test('trims whitespace', () => {
      expect(sanitizeAccountCode('  4111  ')).toBe('4111');
    });

    test('removes non-digits', () => {
      expect(sanitizeAccountCode('4-1-1-1')).toBe('4111');
      expect(sanitizeAccountCode('4.111')).toBe('4111');
      expect(sanitizeAccountCode('4a1b1c1')).toBe('4111');
    });

    test('handles empty string', () => {
      expect(sanitizeAccountCode('')).toBe('');
    });
  });

  describe('getAccountLevelFromCode', () => {
    test('returns correct level', () => {
      expect(getAccountLevelFromCode('4')).toBe(1);
      expect(getAccountLevelFromCode('41')).toBe(2);
      expect(getAccountLevelFromCode('411')).toBe(3);
      expect(getAccountLevelFromCode('4111')).toBe(4);
    });

    test('handles whitespace', () => {
      expect(getAccountLevelFromCode('  4111  ')).toBe(4);
    });
  });

  describe('extractClassCode', () => {
    test('extracts first digit', () => {
      expect(extractClassCode('4')).toBe('4');
      expect(extractClassCode('41')).toBe('4');
      expect(extractClassCode('411')).toBe('4');
      expect(extractClassCode('4111')).toBe('4');
    });

    test('handles empty string', () => {
      expect(extractClassCode('')).toBe('');
    });
  });

  describe('extractParentCode', () => {
    test('extracts parent code', () => {
      expect(extractParentCode('41')).toBe('4');
      expect(extractParentCode('411')).toBe('41');
      expect(extractParentCode('4111')).toBe('411');
    });

    test('returns null for class level', () => {
      expect(extractParentCode('4')).toBeNull();
    });
  });
});
