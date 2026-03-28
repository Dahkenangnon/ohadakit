import { useState } from 'react';
import { ledger } from '../lib/sdk';
import type { Account } from 'ohadakit';

export default function AccountLookup() {
  const [code, setCode] = useState('');
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    const result = ledger.get(trimmed);
    if (result.ok) {
      setAccount(result.data);
      setError(null);
    } else {
      setAccount(null);
      setError(result.error.message);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Account Lookup</h1>
      <p className="mt-2 text-gray-600">
        Enter an account code to view its details and relationships.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="e.g. 4111, 601, 52"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Lookup
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {account && (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">{account.name}</h2>
            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Code:</span>{' '}
                <span className="font-mono font-medium">{account.code}</span>
              </div>
              <div>
                <span className="text-gray-500">Level:</span> {account.level}
              </div>
              <div>
                <span className="text-gray-500">Class:</span> {account.classCode}
              </div>
              <div>
                <span className="text-gray-500">Parent:</span>{' '}
                <span className="font-mono">{account.parentCode ?? 'none'}</span>
              </div>
              <div>
                <span className="text-gray-500">Is Leaf:</span> {account.isLeaf ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="text-gray-500">Children:</span> {account.children.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-medium text-gray-900 mb-2">Path</h3>
            <div className="flex items-center gap-1.5 flex-wrap text-sm">
              {account.path.map((ancestor, i) => (
                <span key={ancestor.code} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-gray-300">&gt;</span>}
                  <button
                    onClick={() => {
                      setCode(ancestor.code);
                      const r = ledger.get(ancestor.code);
                      if (r.ok) { setAccount(r.data); setError(null); }
                    }}
                    className="font-mono text-blue-600 hover:underline"
                  >
                    {ancestor.code}
                  </button>
                </span>
              ))}
            </div>
          </div>

          {account.ancestors.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-2">Ancestors</h3>
              <div className="space-y-1 text-sm">
                {account.ancestors.map(a => (
                  <div key={a.code} className="flex gap-2">
                    <span className="font-mono text-gray-500 w-16">{a.code}</span>
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {account.siblings.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-2">
                Siblings ({account.siblings.length})
              </h3>
              <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
                {account.siblings.map(s => (
                  <div key={s.code} className="flex gap-2">
                    <span className="font-mono text-gray-500 w-16">{s.code}</span>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {account.children.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-2">
                Children ({account.children.length})
              </h3>
              <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
                {account.children.map(c => (
                  <div key={c.code} className="flex gap-2">
                    <button
                      onClick={() => {
                        setCode(c.code);
                        const r = ledger.get(c.code);
                        if (r.ok) { setAccount(r.data); setError(null); }
                      }}
                      className="font-mono text-blue-600 hover:underline w-16 text-left"
                    >
                      {c.code}
                    </button>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
