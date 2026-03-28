import { useState, useEffect, useCallback } from 'react';
import { AccountBook, MemoryStorage } from 'ohadakit';

const book = new AccountBook({ storage: new MemoryStorage() });

const inputClass =
  'rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
const btnPrimary =
  'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors';

interface JournalEntry {
  id: number;
  date: string;
  description: string;
  debitCode: string;
  creditCode: string;
  amount: number;
}

let nextId = 1;

export default function IntegrationPattern() {
  const [initialized, setInitialized] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Form
  const [description, setDescription] = useState('');
  const [debitCode, setDebitCode] = useState('');
  const [creditCode, setCreditCode] = useState('');
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    book.initialize().then(() => setInitialized(true));
  }, []);

  const addEntry = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      const amt = parseFloat(amount);
      if (!description.trim()) {
        setFormError('Description required');
        return;
      }
      if (isNaN(amt) || amt <= 0) {
        setFormError('Amount must be positive');
        return;
      }
      if (!book.has(debitCode.trim())) {
        setFormError(`Unknown debit account: ${debitCode.trim()}`);
        return;
      }
      if (!book.has(creditCode.trim())) {
        setFormError(`Unknown credit account: ${creditCode.trim()}`);
        return;
      }

      const entry: JournalEntry = {
        id: nextId++,
        date: new Date().toISOString().slice(0, 10),
        description: description.trim(),
        debitCode: debitCode.trim(),
        creditCode: creditCode.trim(),
        amount: amt,
      };

      setEntries(prev => [...prev, entry]);
      setDescription('');
      setDebitCode('');
      setCreditCode('');
      setAmount('');
    },
    [description, debitCode, creditCode, amount]
  );

  const resolveName = (code: string): string => {
    return book.getAccountOrNull(code)?.name ?? `Unknown (${code})`;
  };

  // Trial balance
  const trialBalance = entries.reduce<
    Record<string, { debit: number; credit: number }>
  >((acc, entry) => {
    if (!acc[entry.debitCode]) acc[entry.debitCode] = { debit: 0, credit: 0 };
    if (!acc[entry.creditCode])
      acc[entry.creditCode] = { debit: 0, credit: 0 };
    acc[entry.debitCode].debit += entry.amount;
    acc[entry.creditCode].credit += entry.amount;
    return acc;
  }, {});

  const totalDebit = Object.values(trialBalance).reduce(
    (sum, b) => sum + b.debit,
    0
  );
  const totalCredit = Object.values(trialBalance).reduce(
    (sum, b) => sum + b.credit,
    0
  );

  if (!initialized) {
    return <div className="text-sm text-gray-400">Initializing...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Integration Pattern</h1>
      <p className="mt-2 text-gray-600">
        Shows how to use OhadaKit account codes as foreign keys in your app's
        journal entries, and build a trial balance from them.
      </p>

      {/* Architecture diagram */}
      <div className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono overflow-x-auto">
        <pre>{`┌──────────────────────────┐     ┌──────────────────────────┐
│       Your App           │     │       OhadaKit           │
│                          │     │                          │
│  Journal Entries ────────┼─FK──▶  AccountBook             │
│  Balances ───────────────┼─FK──▶    ├─ Official Accounts  │
│  Trial Balance ──────────┼─FK──▶    ├─ Custom Accounts    │
│                          │     │    └─ Name Resolution    │
└──────────────────────────┘     └──────────────────────────┘`}</pre>
      </div>

      {/* Add Journal Entry */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Add Journal Entry</h2>
        <p className="text-sm text-gray-500 mb-3">
          Account codes are validated via <code>book.has(code)</code> before
          saving.
        </p>
        <form onSubmit={addEntry} className="flex flex-wrap gap-2">
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (e.g. Sale to client)"
            className={`flex-1 min-w-48 ${inputClass}`}
          />
          <input
            type="text"
            value={debitCode}
            onChange={e => setDebitCode(e.target.value)}
            placeholder="Debit account (e.g. 411)"
            className={`w-44 ${inputClass}`}
          />
          <input
            type="text"
            value={creditCode}
            onChange={e => setCreditCode(e.target.value)}
            placeholder="Credit account (e.g. 701)"
            className={`w-44 ${inputClass}`}
          />
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            min="0"
            step="0.01"
            className={`w-32 ${inputClass}`}
          />
          <button type="submit" className={btnPrimary}>
            Add Entry
          </button>
        </form>
        {formError && (
          <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}
      </div>

      {/* Journal Table */}
      {entries.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-3">
            Journal ({entries.length})
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Debit</th>
                  <th className="px-4 py-2">Credit</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-gray-500">{entry.date}</td>
                    <td className="px-4 py-2">{entry.description}</td>
                    <td className="px-4 py-2">
                      <span className="font-mono text-xs text-gray-500">
                        {entry.debitCode}
                      </span>
                      <span className="text-gray-400 ml-1 text-xs">
                        {resolveName(entry.debitCode)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-mono text-xs text-gray-500">
                        {entry.creditCode}
                      </span>
                      <span className="text-gray-400 ml-1 text-xs">
                        {resolveName(entry.creditCode)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {entry.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trial Balance */}
      {Object.keys(trialBalance).length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-3">Trial Balance</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="px-4 py-2">Account</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2 text-right">Debit</th>
                  <th className="px-4 py-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(trialBalance)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([code, bal]) => (
                    <tr key={code} className="border-b border-gray-100">
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">
                        {code}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {resolveName(code)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {bal.debit > 0 ? bal.debit.toLocaleString() : ''}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {bal.credit > 0 ? bal.credit.toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                <tr className="font-semibold border-t-2">
                  <td className="px-4 py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {totalDebit.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {totalCredit.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            {totalDebit === totalCredit && totalDebit > 0 && (
              <div className="px-4 py-2 rounded-md bg-green-50 border-t border-green-200 text-sm text-green-700">
                Balanced (debits = credits)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Pattern */}
      <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          The FK Pattern
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Your app stores account <strong>codes</strong> (strings) as foreign
          keys. OhadaKit resolves codes to names, validates existence, and
          provides hierarchy info.
        </p>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          <code>{`// Validate before saving
if (!book.has(debitCode)) throw new Error('Unknown account');

// Resolve names for display
const name = book.getAccountOrNull(code)?.name;

// Save/restore chart state alongside your app data
const snapshot = await book.snapshot();
await db.put('chart-state', JSON.stringify(snapshot));`}</code>
        </pre>
      </div>
    </div>
  );
}
