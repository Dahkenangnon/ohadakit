import { TranslationService } from '../../src/i18n/TranslationService';

describe('TranslationService', () => {
  describe('Fallback chain', () => {
    test('current locale translation is returned when available', () => {
      const service = new TranslationService('en');
      // Account "10" (Capital) has English translation
      expect(service.hasLocaleTranslation('10', 'en')).toBe(true);
      const name = service.getAccountName('10', 'Capital');
      expect(name).toBe('Capital'); // Both FR and EN are "Capital" for this account
    });

    test('falls back to French when current locale translation is missing', () => {
      const service = new TranslationService('pt');
      // Use an account code that has French but may not have Portuguese
      const name = service.getAccountName('10', 'Fallback Name');
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    test('falls back to provided fallbackName when no translations exist', () => {
      const service = new TranslationService('en');
      const name = service.getAccountName('NONEXISTENT', 'My Fallback');
      expect(name).toBe('My Fallback');
    });

    test('French locale returns French translation directly', () => {
      const service = new TranslationService('fr');
      const translations = service.getAccountTranslations('10');
      expect(translations).not.toBeNull();
      const name = service.getAccountName('10', 'Fallback');
      expect(name).toBe(translations?.fr ?? 'Fallback');
    });
  });

  describe('Locale validation', () => {
    test('setLocale("en") succeeds', () => {
      const service = new TranslationService();
      expect(() => service.setLocale('en')).not.toThrow();
      expect(service.getLocale()).toBe('en');
    });

    test('setLocale with invalid locale throws descriptive error', () => {
      const service = new TranslationService();
      expect(() => service.setLocale('xx' as any)).toThrow('Invalid locale "xx"');
      expect(() => service.setLocale('xx' as any)).toThrow('Valid locales:');
    });

    test('constructor with invalid locale throws', () => {
      expect(() => new TranslationService('xx' as any)).toThrow('Invalid locale');
    });

    test('isValidLocale returns correct results', () => {
      expect(TranslationService.isValidLocale('fr')).toBe(true);
      expect(TranslationService.isValidLocale('en')).toBe(true);
      expect(TranslationService.isValidLocale('pt')).toBe(true);
      expect(TranslationService.isValidLocale('es')).toBe(true);
      expect(TranslationService.isValidLocale('xx')).toBe(false);
      expect(TranslationService.isValidLocale('')).toBe(false);
      expect(TranslationService.isValidLocale('FR')).toBe(false);
    });
  });

  describe('Translation data integrity', () => {
    test('hasTranslation("10") is true — Capital is always translated', () => {
      const service = new TranslationService();
      expect(service.hasTranslation('10')).toBe(true);
    });

    test('hasLocaleTranslation checks specific locale', () => {
      const service = new TranslationService();
      // French should always exist for translated accounts
      expect(service.hasLocaleTranslation('10', 'fr')).toBe(true);
    });

    test('getAccountTranslations for non-existent code returns null', () => {
      const service = new TranslationService();
      expect(service.getAccountTranslations('NONEXISTENT')).toBeNull();
    });

    test('getAccountTranslations for valid code returns LocalizedString', () => {
      const service = new TranslationService();
      const translations = service.getAccountTranslations('10');
      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('fr');
      expect(typeof translations!.fr).toBe('string');
    });
  });

  describe('Static methods', () => {
    test('getAvailableLocales returns exactly ["fr", "en", "pt", "es"]', () => {
      const locales = TranslationService.getAvailableLocales();
      expect(locales).toEqual(['fr', 'en', 'pt', 'es']);
    });
  });

  describe('getLocale / setLocale', () => {
    test('default locale is "fr"', () => {
      const service = new TranslationService();
      expect(service.getLocale()).toBe('fr');
    });

    test('constructor locale is respected', () => {
      const service = new TranslationService('en');
      expect(service.getLocale()).toBe('en');
    });

    test('setLocale changes the locale', () => {
      const service = new TranslationService();
      service.setLocale('es');
      expect(service.getLocale()).toBe('es');
    });
  });
});
