/**
 * Translation Service for OhadaKit SDK
 * Provides locale-aware account name retrieval with French fallback
 */

import type { OhadaLocale, LocalizedString } from './types';
import { accountTranslations } from './account-names';

/**
 * Service for retrieving localized account names
 */
export class TranslationService {
  private static readonly VALID_LOCALES: OhadaLocale[] = ['fr', 'en', 'pt', 'es'];

  private locale: OhadaLocale;

  constructor(locale: OhadaLocale = 'fr') {
    if (!TranslationService.isValidLocale(locale)) {
      throw new Error(
        `Invalid locale "${locale}". Valid locales: ${TranslationService.VALID_LOCALES.join(', ')}`
      );
    }
    this.locale = locale;
  }

  static isValidLocale(locale: string): locale is OhadaLocale {
    return TranslationService.VALID_LOCALES.includes(locale as OhadaLocale);
  }

  /**
   * Get localized account name with fallback to French
   * @param code Account code
   * @param fallbackName Default name (usually French from source data)
   * @returns Localized name or fallback
   */
  getAccountName(code: string, fallbackName: string): string {
    const translations = accountTranslations[code];
    if (!translations) {
      return fallbackName;
    }

    // Return translation for current locale, fallback to French, then to provided name
    return translations[this.locale] ?? translations.fr ?? fallbackName;
  }

  /**
   * Get full localized string object for an account
   * @param code Account code
   * @returns LocalizedString or null if not found
   */
  getAccountTranslations(code: string): LocalizedString | null {
    return accountTranslations[code] ?? null;
  }

  /**
   * Check if translations exist for an account code
   * @param code Account code
   * @returns true if translations exist
   */
  hasTranslation(code: string): boolean {
    return code in accountTranslations;
  }

  /**
   * Check if a specific locale translation exists for an account
   * @param code Account code
   * @param locale Locale to check
   * @returns true if translation exists for locale
   */
  hasLocaleTranslation(code: string, locale: OhadaLocale): boolean {
    const translations = accountTranslations[code];
    if (!translations) return false;
    return translations[locale] !== undefined;
  }

  getLocale(): OhadaLocale {
    return this.locale;
  }

  setLocale(locale: OhadaLocale): void {
    if (!TranslationService.isValidLocale(locale)) {
      throw new Error(
        `Invalid locale "${locale}". Valid locales: ${TranslationService.VALID_LOCALES.join(', ')}`
      );
    }
    this.locale = locale;
  }

  static getAvailableLocales(): OhadaLocale[] {
    return ['fr', 'en', 'pt', 'es'];
  }

}
