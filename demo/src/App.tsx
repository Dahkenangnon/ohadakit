import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const demoNavItems = [
  { to: '/lookup',       label: 'Account Lookup' },
  { to: '/search',       label: 'Search & Query' },
  { to: '/classes',      label: 'Class Browser' },
  { to: '/custom',       label: 'Custom Accounts' },
  { to: '/notes',        label: 'Notes & Storage' },
  { to: '/export',       label: 'Export' },
  { to: '/i18n',         label: 'i18n' },
  { to: '/account-book', label: 'AccountBook' },
  { to: '/integration',  label: 'Integration' },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return (localStorage.getItem('ohadakit-theme') as 'light' | 'dark') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('ohadakit-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  return (
    <button
      type="button"
      className="ds-theme-toggle"
      aria-label="Toggle dark mode"
      title="Toggle theme"
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
    >
      <svg className="ds-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <svg className="ds-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-4.34-7.07-1.41 1.41M6.34 17.66 4.93 19.07"/>
      </svg>
    </button>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ─── Topbar ──────────────────────────────────────────── */}
      <header className="ds-topbar">
        <div className="ds-wrap ds-topbar-inner">
          <NavLink to="/" className="ds-brand" aria-label="OhadaKit home">
            <span className="ds-brand-mark" aria-hidden="true">
              <img src="/favicon.svg" alt="" width="28" height="28" />
            </span>
            <span>OhadaKit</span>
          </NavLink>

          <nav className="ds-nav" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `ds-nav-link${isActive ? ' ds-active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/lookup"
              className={({ isActive }) => `ds-nav-link${isActive ? ' ds-active' : ''}`}
            >
              Demos
            </NavLink>
            <span className="ds-nav-divider" aria-hidden="true" />
            <a
              className="ds-nav-link"
              href="https://github.com/Dahkenangnon/ohadakit"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="ds-nav-link"
              href="https://www.npmjs.com/package/ohadakit"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
            </a>
            <span className="ds-nav-divider" aria-hidden="true" />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* ─── Body ────────────────────────────────────────────── */}
      {isHome ? (
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      ) : (
        <div style={{ flex: 1, display: 'flex' }}>
          <aside className="ds-sidebar">
            <p className="ds-sidebar-section">Demos</p>
            {demoNavItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `ds-sidebar-link${isActive ? ' ds-active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </aside>
          <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}
