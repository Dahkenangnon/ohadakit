/**
 * CustomAccountManager unit tests
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { CustomAccountManager } from '../../src/custom/CustomAccountManager';
import { MemoryStorage } from '../../src/storage/MemoryStorage';
import {
  CannotModifyMainAccountError,
  CannotCreateMainAccountError,
  ParentAccountNotFoundError,
  AccountCodeConflictError,
  InvalidCustomCodeError,
} from '../../src/custom/errors';
import { resetDefaultRegistry } from '../../src/core/AccountRegistry';

describe('CustomAccountManager', () => {
  let manager: CustomAccountManager;
  let storage: MemoryStorage;

  beforeEach(async () => {
    // Reset registry to clean state
    resetDefaultRegistry();

    storage = new MemoryStorage();
    manager = new CustomAccountManager({ storage });
    await manager.initialize();
  });

  describe('initialization', () => {
    test('initializes successfully', () => {
      expect(manager.isInitialized()).toBe(true);
    });

    test('throws error when operations called before initialization', async () => {
      const uninitializedManager = new CustomAccountManager({ storage: new MemoryStorage() });

      await expect(async () => {
        await uninitializedManager.createAccount({
          code: '411-VIP',
          name: 'Test',
          parentCode: '411',
        });
      }).rejects.toThrow('not initialized');
    });
  });

  describe('createAccount', () => {
    test('creates a custom account successfully', async () => {
      const result = await manager.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('411-VIP');
        expect(result.data.name).toBe('Clients VIP');
      }
    });

    test('creates account with alphanumeric code', async () => {
      const result = await manager.createAccount({
        code: '601MAINT',
        name: 'Charges de maintenance',
        parentCode: '601',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('601MAINT');
      }
    });

    test('auto-persists to storage', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });

      // Create new manager with same storage to verify persistence
      const newManager = new CustomAccountManager({ storage });
      await newManager.initialize();

      const account = newManager.getByCode('411-VIP');
      expect(account).not.toBeNull();
      expect(account?.name).toBe('Clients VIP');
    });

    test('rejects 2-character main account creation', async () => {
      const result = await manager.createAccount({
        code: '42',
        name: 'New Main',
        parentCode: '4',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(CannotCreateMainAccountError);
      }
    });

    test('rejects non-existent parent', async () => {
      const result = await manager.createAccount({
        code: '999-VIP',
        name: 'Test',
        parentCode: '999',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ParentAccountNotFoundError);
      }
    });

    test('rejects conflicting code', async () => {
      // First create succeeds
      await manager.createAccount({
        code: '411-VIP',
        name: 'First',
        parentCode: '411',
      });

      // Second with same code fails
      const result = await manager.createAccount({
        code: '411-VIP',
        name: 'Second',
        parentCode: '411',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(AccountCodeConflictError);
      }
    });

    test('can add child to custom account', async () => {
      // Create parent custom account
      await manager.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });

      // Create child of custom account
      const result = await manager.createAccount({
        code: '411-VIP-GOLD',
        name: 'Clients VIP Gold',
        parentCode: '411-VIP',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.code).toBe('411-VIP-GOLD');
      }
    });
  });

  describe('deleteCustomAccount', () => {
    test('deletes a custom account', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });

      const result = await manager.deleteCustomAccount('411-VIP');
      expect(result.ok).toBe(true);

      // Verify account is gone
      expect(manager.getByCode('411-VIP')).toBeNull();
    });

    test('rejects deletion of official account', async () => {
      const result = await manager.deleteCustomAccount('4111');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCustomCodeError);
      }
    });

    test('rejects deletion of account with children', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Parent',
        parentCode: '411',
      });
      await manager.createAccount({
        code: '411-VIP-GOLD',
        name: 'Child',
        parentCode: '411-VIP',
      });

      const result = await manager.deleteCustomAccount('411-VIP');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('child');
      }
    });
  });

  describe('updateLabel', () => {
    test('updates label of official 3+ char account', async () => {
      const result = await manager.updateLabel('4111', 'Clients - Particuliers');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toBe('Clients - Particuliers');
      }
    });

    test('updates label of custom account', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Original Name',
        parentCode: '411',
      });

      const result = await manager.updateLabel('411-VIP', 'New Name');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toBe('New Name');
      }
    });

    test('auto-persists label changes', async () => {
      await manager.updateLabel('4111', 'Custom Label');

      // Create new manager to verify persistence
      const newManager = new CustomAccountManager({ storage });
      await newManager.initialize();

      const account = newManager.getByCode('4111');
      expect(account?.name).toBe('Custom Label');
    });

    test('rejects label update for 2-char main account', async () => {
      const result = await manager.updateLabel('41', 'New Name');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(CannotModifyMainAccountError);
      }
    });

    test('preserves original label in override', async () => {
      await manager.updateLabel('4111', 'Custom Label');

      const original = manager.getOriginalLabel('4111');
      expect(original).not.toBe('Custom Label');
      expect(original).toBeTruthy();
    });
  });

  describe('getByCode', () => {
    test('returns official accounts', () => {
      const account = manager.getByCode('4111');
      expect(account).not.toBeNull();
      expect(account?.code).toBe('4111');
    });

    test('returns custom accounts', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });

      const account = manager.getByCode('411-VIP');
      expect(account).not.toBeNull();
      expect(account?.code).toBe('411-VIP');
    });

    test('returns null for non-existent accounts', () => {
      const account = manager.getByCode('999-FAKE');
      expect(account).toBeNull();
    });

    test('returns account with label override applied', async () => {
      await manager.updateLabel('4111', 'Custom Label');

      const account = manager.getByCode('4111');
      expect(account?.name).toBe('Custom Label');
    });
  });

  describe('has', () => {
    test('returns true for official accounts', () => {
      expect(manager.has('4111')).toBe(true);
    });

    test('returns true for custom accounts', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Test',
        parentCode: '411',
      });

      expect(manager.has('411-VIP')).toBe(true);
    });

    test('returns false for non-existent accounts', () => {
      expect(manager.has('999-FAKE')).toBe(false);
    });
  });

  describe('getAll', () => {
    test('returns both official and custom accounts', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Custom',
        parentCode: '411',
      });

      const all = manager.getAll();

      // Should include official accounts
      expect(all.some(a => a.code === '4111')).toBe(true);

      // Should include custom accounts
      expect(all.some(a => a.code === '411-VIP')).toBe(true);
    });

    test('applies label overrides in result', async () => {
      await manager.updateLabel('4111', 'Custom Label');

      const all = manager.getAll();
      const modified = all.find(a => a.code === '4111');

      expect(modified?.name).toBe('Custom Label');
    });
  });

  describe('getCustomAccounts', () => {
    test('returns only custom accounts', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Custom 1',
        parentCode: '411',
      });
      await manager.createAccount({
        code: '411-VIP2',
        name: 'Custom 2',
        parentCode: '411',
      });

      const custom = manager.getCustomAccounts();

      expect(custom.length).toBe(2);
      expect(custom.every(a => a.code.includes('-'))).toBe(true);
    });
  });

  describe('getChildren', () => {
    test('returns official children', () => {
      const children = manager.getChildren('41');
      expect(children.length).toBeGreaterThan(0);
    });

    test('includes custom children', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Custom Child',
        parentCode: '411',
      });

      const children = manager.getChildren('411');

      expect(children.some(c => c.code === '411-VIP')).toBe(true);
    });
  });

  describe('searchByName', () => {
    test('finds official accounts by name', () => {
      const results = manager.searchByName('client');
      expect(results.length).toBeGreaterThan(0);
    });

    test('finds custom accounts by name', async () => {
      await manager.createAccount({
        code: '411-SPECIAL',
        name: 'Clients Speciaux',
        parentCode: '411',
      });

      const results = manager.searchByName('speciaux');
      expect(results.some(a => a.code === '411-SPECIAL')).toBe(true);
    });

    test('finds accounts with modified labels', async () => {
      await manager.updateLabel('4111', 'Recherche Unique');

      const results = manager.searchByName('recherche unique');
      expect(results.some(a => a.code === '4111')).toBe(true);
    });
  });

  describe('getStats', () => {
    test('returns correct statistics', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Custom 1',
        parentCode: '411',
      });
      await manager.updateLabel('4111', 'Modified');

      const stats = manager.getStats();

      expect(stats.customAccountCount).toBe(1);
      expect(stats.labelOverrideCount).toBe(1);
      expect(stats.byClass['4']).toBe(1);
    });
  });

  describe('clear', () => {
    test('removes all custom data', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Custom',
        parentCode: '411',
      });
      await manager.updateLabel('4111', 'Modified');

      await manager.clear();

      expect(manager.getCustomAccounts().length).toBe(0);
      expect(manager.getLabelOverrides().length).toBe(0);
    });
  });

  describe('persistence', () => {
    test('persists and loads custom accounts correctly', async () => {
      await manager.createAccount({
        code: '411-VIP',
        name: 'Clients VIP',
        parentCode: '411',
      });
      await manager.createAccount({
        code: '601-MAINT',
        name: 'Maintenance',
        parentCode: '601',
      });
      await manager.updateLabel('4111', 'Custom Label');

      // Create new manager with same storage
      const newManager = new CustomAccountManager({ storage });
      await newManager.initialize();

      // Verify custom accounts loaded
      expect(newManager.has('411-VIP')).toBe(true);
      expect(newManager.has('601-MAINT')).toBe(true);

      // Verify label override loaded
      const account = newManager.getByCode('4111');
      expect(account?.name).toBe('Custom Label');

      // Verify stats
      const stats = newManager.getStats();
      expect(stats.customAccountCount).toBe(2);
      expect(stats.labelOverrideCount).toBe(1);
    });
  });
});
