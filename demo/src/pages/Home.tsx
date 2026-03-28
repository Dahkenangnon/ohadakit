import { Link } from 'react-router-dom';
import { ledger } from '../lib/sdk';

const stats = ledger.getStats();

const features = [
  { to: '/lookup', title: 'Account Lookup', desc: 'Search by code, view details and relationships' },
  { to: '/search', title: 'Search & Query', desc: 'Fluent query builder, fuzzy search, filters' },
  { to: '/classes', title: 'Class Browser', desc: 'Navigate the 9 OHADA classes and hierarchies' },
  { to: '/custom', title: 'Custom Accounts', desc: 'Create sub-accounts and override labels' },
  { to: '/notes', title: 'Notes & Storage', desc: 'Attach notes with pluggable storage adapters' },
  { to: '/export', title: 'Export', desc: 'JSON and CSV export with options' },
  { to: '/i18n', title: 'Internationalization', desc: 'Locale switching across 4 languages' },
  { to: '/account-book', title: 'AccountBook', desc: 'Unified facade with snapshot/restore' },
  { to: '/integration', title: 'Integration Pattern', desc: 'Journal entries and trial balance using OhadaKit as FK source' },
];

const statCards = [
  { label: 'Total Accounts', value: stats.total },
  { label: 'Classes', value: 9 },
  { label: 'Levels', value: 4 },
  { label: 'Locales', value: 4 },
];

export default function Home() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">OhadaKit Demo</h1>
      <p className="mt-2 text-gray-600">
        Production-ready TypeScript SDK for the OHADA/SYSCOHADA accounting chart of accounts.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {statCards.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-600">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map(({ to, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Quick Start</h2>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
        <code>{`import { LedgerEngine } from 'ohadakit';

const ledger = new LedgerEngine();

const result = ledger.get('4111');
if (result.ok) {
  console.log(result.data.name);       // "Clients"
  console.log(result.data.pathString); // "41 > 411 > 4111"
}

// Query builder
const expenses = ledger.query()
  .inClass('6')
  .atLevel(3)
  .nameContains('personnel')
  .execute();`}</code>
      </pre>
    </div>
  );
}
