import { useState, useMemo } from 'react';
import { ledger } from '../lib/sdk';
import type { Account } from 'ohadakit';

type SearchMode = 'name' | 'prefix' | 'fuzzy';

export default function SearchQuery() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('name');
  const [classFilter, setClassFilter] = useState('');
  const [levelFilters, setLevelFilters] = useState<number[]>([]);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const start = performance.now();
    let accounts: Account[];

    switch (mode) {
      case 'name':
        accounts = ledger.query().nameContains(query).execute();
        break;
      case 'prefix':
        accounts = ledger.registry.searchByPrefix(query);
        break;
      case 'fuzzy':
        accounts = ledger.query().search(query, { fuzzy: true, threshold: 0.6 }).execute();
        break;
    }

    if (classFilter) {
      accounts = accounts.filter(a => a.classCode === classFilter);
    }
    if (levelFilters.length > 0) {
      accounts = accounts.filter(a => levelFilters.includes(a.level));
    }

    const elapsed = performance.now() - start;
    return { accounts: accounts.slice(0, 100), total: accounts.length, ms: elapsed };
  }, [query, mode, classFilter, levelFilters]);

  function toggleLevel(level: number) {
    setLevelFilters(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Search & Query</h1>
      <p className="mt-2 text-gray-600">
        Use the query builder with name search, prefix search, or fuzzy matching.
      </p>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search accounts..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-1">
            {(['name', 'prefix', 'fuzzy'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  mode === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m === 'name' ? 'Name Search' : m === 'prefix' ? 'Prefix' : 'Fuzzy'}
              </button>
            ))}
          </div>

          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
          >
            <option value="">All Classes</option>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>

          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-500">Level:</span>
            {[2, 3, 4].map(l => (
              <button
                key={l}
                onClick={() => toggleLevel(l)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  levelFilters.includes(l)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results && 'total' in results && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-3">
            {results.total} result{results.total !== 1 ? 's' : ''} in {results.ms.toFixed(1)}ms
            {results.total > 100 && ' (showing first 100)'}
          </p>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {results.accounts.map(account => (
              <div key={account.code} className="px-4 py-2.5 flex items-center gap-4">
                <span className="font-mono text-sm text-gray-500 w-16 shrink-0">
                  {account.code}
                </span>
                <span className="text-sm flex-1">{account.name}</span>
                <span className="text-xs text-gray-400">L{account.level}</span>
              </div>
            ))}
            {results.accounts.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No accounts found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
