import { useState } from 'react';
import { ledger } from '../lib/sdk';
import type { OhadaLocale } from 'ohadakit';

const SAMPLE_CODES = [
  '10', '101', '21', '41', '411', '4111', '52', '601', '70', '81',
];

const LOCALE_LABELS: Record<OhadaLocale, string> = {
  fr: 'French',
  en: 'English',
  pt: 'Portuguese',
  es: 'Spanish',
};

export default function I18n() {
  const [locale, setLocale] = useState<OhadaLocale>('fr');
  const availableLocales = ledger.getAvailableLocales();

  // Temporarily switch locale to get translations
  function getNameInLocale(code: string, loc: OhadaLocale): string | null {
    const prevLocale = ledger.getLocale();
    ledger.setLocale(loc);
    const name = ledger.getLocalizedName(code);
    ledger.setLocale(prevLocale);
    return name;
  }

  const rows = SAMPLE_CODES.map(code => {
    const account = ledger.getOrNull(code);
    if (!account) return null;
    return {
      code,
      frenchName: account.name,
      localizedName: getNameInLocale(code, locale),
      isFallback: locale !== 'fr' && getNameInLocale(code, locale) === account.name,
    };
  }).filter(Boolean) as Array<{
    code: string;
    frenchName: string;
    localizedName: string | null;
    isFallback: boolean;
  }>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Internationalization</h1>
      <p className="mt-2 text-gray-600">
        OhadaKit supports 4 OHADA locales. Translations fall back to French when missing.
      </p>

      <div className="mt-6 flex gap-2">
        {availableLocales.map(loc => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              locale === loc
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {LOCALE_LABELS[loc]} ({loc})
          </button>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2.5 font-medium text-gray-500 w-20">Code</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">French (source)</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">
                {LOCALE_LABELS[locale]} ({locale})
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500 w-20">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.code}>
                <td className="px-4 py-2.5 font-mono text-gray-500">{row.code}</td>
                <td className="px-4 py-2.5">{row.frenchName}</td>
                <td className="px-4 py-2.5">{row.localizedName}</td>
                <td className="px-4 py-2.5">
                  {locale === 'fr' ? (
                    <span className="text-xs text-gray-400">source</span>
                  ) : row.isFallback ? (
                    <span className="text-xs text-amber-500 font-medium">fallback</span>
                  ) : (
                    <span className="text-xs text-green-600 font-medium">translated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          French is the primary OHADA language (13 of 17 member countries).
          When a translation is missing, OhadaKit falls back to the French name.
        </p>
      </div>
    </div>
  );
}
