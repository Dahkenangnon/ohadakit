import { NavLink, Outlet } from 'react-router-dom';
import { ledger } from './lib/sdk';

const stats = ledger.getStats();

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/lookup', label: 'Account Lookup' },
  { to: '/search', label: 'Search & Query' },
  { to: '/classes', label: 'Class Browser' },
  { to: '/custom', label: 'Custom Accounts' },
  { to: '/notes', label: 'Notes & Storage' },
  { to: '/export', label: 'Export' },
  { to: '/i18n', label: 'i18n' },
  { to: '/account-book', label: 'AccountBook' },
  { to: '/integration', label: 'Integration Pattern' },
];

export default function App() {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">OhadaKit</h1>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total} accounts &middot; 9 classes
          </p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
          <a
            href="https://github.com/Dahkenangnon/OhadaKit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            GitHub
          </a>
          {' '}&middot;{' '}
          <a
            href="https://www.npmjs.com/package/ohadakit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            npm
          </a>
        </div>
      </aside>
      <main className="ml-64 p-8 min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
