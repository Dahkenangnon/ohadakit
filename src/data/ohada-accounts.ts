/**
 * OHADA account data loader
 * Imports full OHADA dataset (1000+ accounts)
 */

import type { RawAccountData, OhadaClass } from '../core/types';
import { flatAccounts } from './ohada/accounts-flat';
import { ohadaClasses } from './ohada/classes';

/**
 * OHADA classes metadata (from official OHADA implementation)
 * Built dynamically from the ohadaClasses array
 */
export const OHADA_CLASSES: Record<string, OhadaClass> = {};

// Build the OHADA_CLASSES object from the array
ohadaClasses.forEach(classRef => {
  OHADA_CLASSES[classRef.code] = {
    code: classRef.code as any,
    name: classRef.name,
    nameEn: classRef.nameEn ?? classRef.name,
    description: classRef.name,
    descriptionEn: classRef.nameEn ?? classRef.name
  };
});

/**
 * Load raw OHADA account data
 * Returns all 1000+ accounts from the official OHADA chart
 */
export function loadOhadaAccounts(): RawAccountData[] {
  return flatAccounts.map(acc => ({
    code: acc.code,
    name: acc.name,
    level: acc.level as 1 | 2 | 3 | 4,
    classCode: acc.classCode,
    parentCode: acc.parentCode
  }));
}

/**
 * Get class metadata by code
 */
export function getClassMetadata(classCode: string): OhadaClass | null {
  return OHADA_CLASSES[classCode] ?? null;
}

/**
 * Get all class codes
 */
export function getAllClassCodes(): string[] {
  return Object.keys(OHADA_CLASSES);
}
