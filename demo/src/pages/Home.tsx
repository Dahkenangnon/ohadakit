import { Link } from 'react-router-dom';
import { ledger } from '../lib/sdk';

const stats = ledger.getStats();

const demoPages = [
  { to: '/lookup',       title: 'Account Lookup',     desc: 'Get any account by code in O(1). View parent, children, level, path.' },
  { to: '/search',       title: 'Search & Query',     desc: 'Fluent API: filter by class, level, isLeaf, nameContains, and more.' },
  { to: '/classes',      title: 'Class Browser',      desc: 'Navigate all 9 OHADA/SYSCOHADA classes and their full hierarchies.' },
  { to: '/custom',       title: 'Custom Accounts',    desc: 'Add sub-accounts and override standard labels to match your chart.' },
  { to: '/notes',        title: 'Notes & Storage',    desc: 'Attach notes to any account with pluggable storage adapters.' },
  { to: '/export',       title: 'Export',             desc: 'Export the full chart or any subset to JSON or CSV.' },
  { to: '/i18n',         title: 'Internationalization', desc: 'Switch locales at runtime — French, English, Portuguese, Spanish.' },
  { to: '/account-book', title: 'AccountBook',        desc: 'Unified facade with snapshot/restore for whole-ledger operations.' },
  { to: '/integration',  title: 'Integration Pattern', desc: 'Journal entries and trial balance using OhadaKit as an FK source.' },
];

const features = [
  { title: 'O(1) Lookups',        desc: 'Every account accessible in constant time via an internal Map.' },
  { title: 'Trie Prefix Search',  desc: 'Prefix search on codes and full-text search on names.' },
  { title: 'Fluent Query Builder', desc: 'Chain .byClass(), .level(), .isLeaf(), .nameContains() then .get().' },
  { title: 'i18n — 4 locales',   desc: 'Labels in French, English, Portuguese, and Spanish at runtime.' },
  { title: 'Custom Overlays',     desc: 'Merge your accounts and override standard labels without mutation.' },
  { title: 'Zero dependencies',   desc: 'Pure TypeScript. Ships as ESM + CJS + browser UMD.' },
];

const INSTALL_CODE = 'npm install ohadakit';
const USAGE_CODE = `import { LedgerEngine } from 'ohadakit';

const ledger = new LedgerEngine();

// O(1) account lookup
const result = ledger.get('4111');
if (result.ok) {
  console.log(result.data.name);        // "Clients"
  console.log(result.data.pathString);  // "4 › 41 › 411 › 4111"
}`;
const QUERY_CODE = `// Fluent query builder
const leafExpenses = ledger.query()
  .byClass(6)
  .level(4)
  .isLeaf(true)
  .get();

// i18n — switch locale at runtime
ledger.setLocale('en');
const label = ledger.getLabel('4111'); // "Clients"`;

function copyBtn(text: string) {
  return (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text).then(() => {
      const btn = e.currentTarget;
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
    });
  };
}

export default function Home() {
  return (
    <>
      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="ds-hero">
        <div className="ds-wrap">
          <span className="ds-eyebrow">
            <span className="dot" aria-hidden="true" />
            Open · TypeScript · Zero dependencies
          </span>

          <h1 className="ds-hero-title">
            Chart of accounts for <em>OHADA &amp; SYSCOHADA</em>.
          </h1>

          <p className="ds-hero-sub">
            OhadaKit is a production-ready TypeScript SDK providing the complete OHADA/SYSCOHADA
            chart of accounts — {stats.total}+ accounts, O(1) lookups, a fluent query builder,
            i18n across 4 locales, custom account overlays, snapshot/restore, and export.
            No API keys, no backend, no dependencies.
          </p>

          <div className="ds-cta-row">
            <Link to="/lookup" className="ds-btn ds-btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="8 18 14 12 8 6"/>
              </svg>
              Explore demos
            </Link>
            <a className="ds-btn ds-btn-secondary"
               href="https://github.com/Dahkenangnon/ohadakit"
               target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.7.9 1.2 1.9 1.2 3.2 0 4.5-2.8 5.5-5.4 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── Quick start ────────────────────────────────────── */}
      <section className="ds-section" id="quickstart">
        <div className="ds-wrap">
          <p className="ds-section-eyebrow">Quick start</p>
          <h2 className="ds-section-title">Up and running in seconds.</h2>
          <p className="ds-section-lede">
            Install via npm or import the ES module. The same <code>LedgerEngine</code> API
            works in Node.js, browsers, Vite, Next.js, and any TypeScript project.
          </p>

          <div className="ds-code-grid">
            <div className="ds-code-card">
              <div className="ds-code-head">
                <span className="ds-code-tag">Install</span>
                <button type="button" className="ds-copy-btn" onClick={copyBtn(INSTALL_CODE)}>Copy</button>
              </div>
              <pre className="ds-pre"><span className="kw">npm install</span> ohadakit</pre>
            </div>

            <div className="ds-code-card">
              <div className="ds-code-head">
                <span className="ds-code-tag">Basic usage</span>
                <button type="button" className="ds-copy-btn" onClick={copyBtn(USAGE_CODE)}>Copy</button>
              </div>
              <pre className="ds-pre"><span className="kw">import</span> {'{ LedgerEngine } '}<span className="kw">from</span> <span className="str">'ohadakit'</span>{`;

`}<span className="kw">const</span>{` ledger = `}<span className="kw">new</span>{` LedgerEngine();

`}<span className="com">// O(1) account lookup</span>{`
`}<span className="kw">const</span>{` result = ledger.get(`}<span className="str">'4111'</span>{`);
`}<span className="kw">if</span>{` (result.ok) {
  console.log(result.data.name);       `}<span className="com">// "Clients"</span>{`
  console.log(result.data.pathString); `}<span className="com">// "4 › 41 › 411 › 4111"</span>{`
}`}</pre>
            </div>

            <div className="ds-code-card span2">
              <div className="ds-code-head">
                <span className="ds-code-tag">Query builder &amp; i18n</span>
                <button type="button" className="ds-copy-btn" onClick={copyBtn(QUERY_CODE)}>Copy</button>
              </div>
              <pre className="ds-pre"><span className="com">// Fluent query builder</span>{`
`}<span className="kw">const</span>{` leafExpenses = ledger.query()
  .byClass(`}<span className="num">6</span>{`)
  .level(`}<span className="num">4</span>{`)
  .isLeaf(`}<span className="kw">true</span>{`)
  .get();

`}<span className="com">// i18n — switch locale at runtime</span>{`
ledger.setLocale(`}<span className="str">'en'</span>{`);
`}<span className="kw">const</span>{` label = ledger.getLabel(`}<span className="str">'4111'</span>{`); `}<span className="com">// "Clients"</span></pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Coverage + features ────────────────────────────── */}
      <section className="ds-section" id="coverage">
        <div className="ds-wrap">
          <p className="ds-section-eyebrow">Coverage</p>
          <h2 className="ds-section-title">The complete OHADA chart of accounts.</h2>
          <p className="ds-section-lede">
            All {stats.total}+ standard OHADA/SYSCOHADA accounts across 9 classes, organized
            in up to 4 hierarchy levels — shipped as static data in a single zero-dep bundle.
          </p>

          <dl className="ds-stats-grid">
            <div className="ds-stat-card"><dt>Total Accounts</dt><dd>{stats.total}+</dd></div>
            <div className="ds-stat-card"><dt>Classes</dt><dd>9</dd></div>
            <div className="ds-stat-card"><dt>Levels</dt><dd>4</dd></div>
            <div className="ds-stat-card"><dt>Locales</dt><dd>4</dd></div>
          </dl>

          <div className="ds-feat-grid">
            {features.map(({ title, desc }) => (
              <div key={title} className="ds-feat-card">
                <span className="ds-feat-card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {title}
                </span>
                <small>{desc}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive demos ───────────────────────────────── */}
      <section className="ds-section" id="demos">
        <div className="ds-wrap">
          <p className="ds-section-eyebrow">Interactive demos</p>
          <h2 className="ds-section-title">Explore every API surface.</h2>
          <p className="ds-section-lede">
            Each demo below runs live in your browser against the full OHADA chart of accounts.
          </p>

          <div className="ds-feat-grid">
            {demoPages.map(({ to, title, desc }) => (
              <Link key={to} to={to} className="ds-feat-card">
                <span className="ds-feat-card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  {title}
                </span>
                <small>{desc}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="ds-footer">
        <div className="ds-wrap ds-foot-grid">
          <p>
            Built by{' '}
            <a href="https://github.com/Dahkenangnon" target="_blank" rel="noopener noreferrer">
              Justin Dah-kenangnon
            </a>
            . OhadaKit — OHADA/SYSCOHADA chart of accounts SDK for TypeScript.
          </p>
          <p>
            <a href="https://github.com/Dahkenangnon/ohadakit/blob/main/LICENSE"
               target="_blank" rel="noopener noreferrer">MIT</a>
            {' '}&middot;{' '}
            <a href="https://github.com/Dahkenangnon/ohadakit"
               target="_blank" rel="noopener noreferrer">GitHub</a>
            {' '}&middot;{' '}
            <a href="https://www.npmjs.com/package/ohadakit"
               target="_blank" rel="noopener noreferrer">npm</a>
          </p>
        </div>
      </footer>
    </>
  );
}
