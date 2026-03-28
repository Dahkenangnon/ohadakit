import { OhadaFlatAccount } from './types';
import { class1 } from './class-1-ressources';
import { class2 } from './class-2-immobilisations';
import { class3 } from './class-3-stocks';
import { class4 } from './class-4-tiers';
import { class5 } from './class-5-tresorerie';
import { class6 } from './class-6-charges';
import { class7 } from './class-7-produits';
import { class8 } from './class-8-hao';
import { class9 } from './class-9-engagements';
import type { OhadaAccount, OhadaClass } from './types';

/**
 * Flatten hierarchical account structure into a single array
 * with parent references and paths
 */
function flattenAccounts(
  accounts: OhadaAccount[],
  classCode: string,
  parentPath: string[] = []
): OhadaFlatAccount[] {
  const result: OhadaFlatAccount[] = [];

  for (const account of accounts) {
    const currentPath = [...parentPath, account.code];

    const flatAccount: OhadaFlatAccount = {
      code: account.code,
      name: account.name,
      level: account.level,
      classCode: classCode,
      parentCode: account.parentCode,
      path: currentPath.join(' > ')
    };

    result.push(flatAccount);

    // Recursively flatten sub-accounts
    if (account.subAccounts && account.subAccounts.length > 0) {
      const subAccounts = flattenAccounts(
        account.subAccounts,
        classCode,
        currentPath
      );
      result.push(...subAccounts);
    }
  }

  return result;
}

/**
 * Flatten all classes into a single array
 */
function flattenAllClasses(classes: OhadaClass[]): OhadaFlatAccount[] {
  const result: OhadaFlatAccount[] = [];

  for (const ohadaClass of classes) {
    const classAccounts = flattenAccounts(
      ohadaClass.accounts,
      ohadaClass.code,
      [ohadaClass.code]
    );
    result.push(...classAccounts);
  }

  return result;
}

/**
 * All OHADA accounts in flat structure
 * Total: ~1000+ accounts across all 9 classes and 4 levels
 */
export const flatAccounts: OhadaFlatAccount[] = flattenAllClasses([
  class1,
  class2,
  class3,
  class4,
  class5,
  class6,
  class7,
  class8,
  class9
]);

/**
 * Helper: Get accounts by class code
 */
export function getAccountsByClass(classCode: string): OhadaFlatAccount[] {
  return flatAccounts.filter(acc => acc.classCode === classCode);
}

/**
 * Helper: Get accounts by level
 */
export function getAccountsByLevel(level: number): OhadaFlatAccount[] {
  return flatAccounts.filter(acc => acc.level === level);
}

/**
 * Helper: Get account by code
 */
export function getAccountByCode(code: string): OhadaFlatAccount | undefined {
  return flatAccounts.find(acc => acc.code === code);
}

/**
 * Helper: Get all child accounts of a parent
 */
export function getChildAccounts(parentCode: string): OhadaFlatAccount[] {
  return flatAccounts.filter(acc => acc.parentCode === parentCode);
}

/**
 * Helper: Search accounts by name or code
 */
export function searchFlatAccounts(query: string): OhadaFlatAccount[] {
  const lowerQuery = query.toLowerCase();
  return flatAccounts.filter(acc =>
    acc.name.toLowerCase().includes(lowerQuery) ||
    acc.code.includes(query)
  );
}

/**
 * Statistics
 */
export const flatAccountsStats = {
  total: flatAccounts.length,
  byClass: {
    class1: flatAccounts.filter(a => a.classCode === '1').length,
    class2: flatAccounts.filter(a => a.classCode === '2').length,
    class3: flatAccounts.filter(a => a.classCode === '3').length,
    class4: flatAccounts.filter(a => a.classCode === '4').length,
    class5: flatAccounts.filter(a => a.classCode === '5').length,
    class6: flatAccounts.filter(a => a.classCode === '6').length,
    class7: flatAccounts.filter(a => a.classCode === '7').length,
    class8: flatAccounts.filter(a => a.classCode === '8').length,
    class9: flatAccounts.filter(a => a.classCode === '9').length
  },
  byLevel: {
    level2: flatAccounts.filter(a => a.level === 2).length,
    level3: flatAccounts.filter(a => a.level === 3).length,
    level4: flatAccounts.filter(a => a.level === 4).length
  }
};
