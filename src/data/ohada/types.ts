/**
 * OHADA Chart of Accounts - Type Definitions
 * Acte uniforme portant organisation et harmonisation des comptabilités des entreprises (2000)
 */

/**
 * Represents an individual account in the OHADA chart
 */
export interface OhadaAccount {
  /** Account code (2-4 digits) */
  code: string;
  /** Account name in French */
  name: string;
  /** Hierarchical level (2=main account, 3=sub-account, 4=sub-sub-account) */
  level: number;
  /** Parent account code (undefined for level 2 accounts) */
  parentCode?: string;
  /** Nested sub-accounts (hierarchical structure only) */
  subAccounts?: OhadaAccount[];
}

/**
 * Represents a flat account with additional relationship metadata
 */
export interface OhadaFlatAccount {
  /** Account code (2-4 digits) */
  code: string;
  /** Account name in French */
  name: string;
  /** Hierarchical level (2=main account, 3=sub-account, 4=sub-sub-account) */
  level: number;
  /** Class number (1-9) */
  classCode: string;
  /** Parent account code (undefined for level 2 accounts) */
  parentCode?: string;
  /** Full hierarchical path (e.g., "1 > 10 > 101 > 1011") */
  path: string;
}

/**
 * Represents a class (major category) in the OHADA chart
 */
export interface OhadaClass {
  /** Class code (1-9) */
  code: string;
  /** Class name in French */
  name: string;
  /** English name */
  nameEn?: string;
  /** Portuguese name */
  namePt?: string;
  /** Spanish name */
  nameEs?: string;
  /** All accounts within this class (hierarchical structure) */
  accounts: OhadaAccount[];
}

/**
 * Represents class metadata for the index
 */
export interface OhadaClassReference {
  /** Class code (1-9) */
  code: string;
  /** Class name in French */
  name: string;
  /** English name */
  nameEn?: string;
  /** Portuguese name */
  namePt?: string;
  /** Spanish name */
  nameEs?: string;
  /** TypeScript module filename */
  file: string;
}

/**
 * Main index structure for the OHADA chart
 */
export interface OhadaChartIndex {
  /** Version identifier */
  version: string;
  /** Full name of the accounting standard */
  name: string;
  /** Source document */
  source: string;
  /** Publication date */
  date: string;
  /** References to all class files */
  classes: OhadaClassReference[];
}
