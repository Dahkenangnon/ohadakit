/**
 * OHADA Chart of Accounts - Main Entry Point
 * Complete OHADA accounting chart with all 9 classes
 *
 * Acte uniforme portant organisation et harmonisation
 * des comptabilités des entreprises (February 22, 2000)
 */

import { OhadaChartIndex, OhadaClass, OhadaAccount } from './types';
import { ohadaClasses } from './classes';
import { class1 } from './class-1-ressources';
import { class2 } from './class-2-immobilisations';
import { class3 } from './class-3-stocks';
import { class4 } from './class-4-tiers';
import { class5 } from './class-5-tresorerie';
import { class6 } from './class-6-charges';
import { class7 } from './class-7-produits';
import { class8 } from './class-8-hao';
import { class9 } from './class-9-engagements';

/**
 * Main OHADA Chart Index
 */
export const ohadaChartIndex: OhadaChartIndex = {
  version: "2000",
  name: "Plan Comptable OHADA",
  source: "Acte uniforme portant organisation et harmonisation des comptabilités des entreprises",
  date: "2000-02-22",
  classes: ohadaClasses
};

/**
 * All OHADA classes exported as array
 */
export const allClasses: OhadaClass[] = [
  class1,
  class2,
  class3,
  class4,
  class5,
  class6,
  class7,
  class8,
  class9
];

/**
 * Helper function to get a specific class by code
 * @param classCode - Class code (1-9)
 * @returns The requested class or undefined
 */
export function getClass(classCode: string): OhadaClass | undefined {
  return allClasses.find(c => c.code === classCode);
}

/**
 * Helper function to find an account by code across all classes
 * @param accountCode - Account code (e.g., "101", "4111")
 * @returns The account or undefined
 */
export function findAccount(accountCode: string): OhadaAccount | undefined {
  for (const ohadaClass of allClasses) {
    const result = searchAccountInTree(ohadaClass.accounts, accountCode);
    if (result) return result;
  }
  return undefined;
}

/**
 * Recursive helper to search account in tree
 */
function searchAccountInTree(accounts: OhadaAccount[], code: string): OhadaAccount | undefined {
  for (const account of accounts) {
    if (account.code === code) return account;
    if (account.subAccounts) {
      const result = searchAccountInTree(account.subAccounts, code);
      if (result) return result;
    }
  }
  return undefined;
}

/**
 * Get all accounts of a specific level
 * @param level - Level number (2, 3, or 4)
 * @returns Array of accounts at that level
 */
export function getAccountsByLevel(level: number): OhadaAccount[] {
  const results: OhadaAccount[] = [];

  function collectAccounts(accounts: OhadaAccount[]) {
    for (const account of accounts) {
      if (account.level === level) {
        results.push(account);
      }
      if (account.subAccounts) {
        collectAccounts(account.subAccounts);
      }
    }
  }

  for (const ohadaClass of allClasses) {
    collectAccounts(ohadaClass.accounts);
  }

  return results;
}

/**
 * Search accounts by name (case-insensitive, partial match)
 * @param query - Search query
 * @returns Array of matching accounts
 */
export function searchAccounts(query: string): OhadaAccount[] {
  const results: OhadaAccount[] = [];
  const lowerQuery = query.toLowerCase();

  function search(accounts: OhadaAccount[]) {
    for (const account of accounts) {
      if (account.name.toLowerCase().includes(lowerQuery) ||
          account.code.includes(query)) {
        results.push(account);
      }
      if (account.subAccounts) {
        search(account.subAccounts);
      }
    }
  }

  for (const ohadaClass of allClasses) {
    search(ohadaClass.accounts);
  }

  return results;
}

/**
 * Get account with its full hierarchical path
 * @param accountCode - Account code
 * @returns Account with path or undefined
 */
export function getAccountWithPath(accountCode: string): { account: OhadaAccount; path: string[] } | undefined {
  const path: string[] = [];

  function searchWithPath(accounts: OhadaAccount[]): OhadaAccount | undefined {
    for (const account of accounts) {
      path.push(account.code);
      if (account.code === accountCode) return account;
      if (account.subAccounts) {
        const result = searchWithPath(account.subAccounts);
        if (result) return result;
      }
      path.pop();
    }
    return undefined;
  }

  for (const ohadaClass of allClasses) {
    path.length = 0;
    path.push(ohadaClass.code);
    const account = searchWithPath(ohadaClass.accounts);
    if (account) return { account, path };
  }

  return undefined;
}

/**
 * Count total number of accounts across all classes
 * @returns Total account count
 */
export function getTotalAccountCount(): number {
  let count = 0;

  function countAccounts(accounts: OhadaAccount[]) {
    count += accounts.length;
    for (const account of accounts) {
      if (account.subAccounts) {
        countAccounts(account.subAccounts);
      }
    }
  }

  for (const ohadaClass of allClasses) {
    countAccounts(ohadaClass.accounts);
  }

  return count;
}

// Re-export types for convenience
export * from './types';

// Re-export individual classes
export { class1, class2, class3, class4, class5, class6, class7, class8, class9 };
export { ohadaClasses };
