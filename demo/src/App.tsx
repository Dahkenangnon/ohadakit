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

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar whenever the route changes (user tapped a nav link)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="ds-shell">

      {/* ─── Topbar ──────────────────────────────────────────── */}
      <header className="ds-topbar">
        <div className="ds-wrap ds-topbar-inner">

          <div className="ds-topbar-left">
            {/* Hamburger — only rendered on demo pages, hidden via CSS on desktop */}
            {!isHome && (
              <button
                type="button"
                className="ds-menu-btn"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen(o => !o)}
              >
                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            )}
            <NavLink to="/" className="ds-brand" aria-label="OhadaKit home">
              <span className="ds-brand-mark" aria-hidden="true">
                <img src="/favicon.svg" alt="" width="28" height="28" />
              </span>
              <span>OhadaKit</span>
            </NavLink>
          </div>

          <nav className="ds-nav" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `ds-nav-link ds-nav-keep${isActive ? ' ds-active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/lookup"
              className={({ isActive }) => `ds-nav-link ds-nav-keep${isActive ? ' ds-active' : ''}`}
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
        <main className="ds-body-home">
          <Outlet />
        </main>
      ) : (
        <div className="ds-body-demo">

          {/* Backdrop overlay — mobile only, closes sidebar on tap */}
          {sidebarOpen && (
            <div
              className="ds-sidebar-backdrop"
              aria-hidden="true"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside className={`ds-sidebar${sidebarOpen ? ' ds-sidebar-open' : ''}`}>
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

          <main className="ds-main">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}
