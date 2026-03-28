/**
 * i18n Types for OhadaKit SDK
 * Supports 4 OHADA locales across 17 member countries
 */

export type { OhadaLocale } from '../core/types';

/**
 * Localized string with French as required primary language
 */
export interface LocalizedString {
  /** French name (required - primary OHADA language) */
  fr: string;
  /** English translation (optional) */
  en?: string;
  /** Portuguese translation (optional) */
  pt?: string;
  /** Spanish translation (optional) */
  es?: string;
}

/**
 * Account translations indexed by account code
 */
export type AccountTranslations = Record<string, LocalizedString>;

/**
 * Class translations for the 9 OHADA classes
 */
export interface ClassTranslations {
  name: LocalizedString;
  description?: LocalizedString;
}
