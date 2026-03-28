import { useState, useEffect, useCallback } from 'react';
import { AccountBook, MemoryStorage } from 'ohadakit';
import type { Account, AccountBookSnapshot, AccountBookStats } from 'ohadakit';

const book = new AccountBook({ storage: new MemoryStorage() });

const inputClass =
  'rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
const btnPrimary =
  'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors';
const btnSecondary =
  'rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors';

export default function AccountBookDemo() {
  const [initialized, setInitialized] = useState(false);
  const [stats, setStats] = useState<AccountBookStats | null>(null);

  // Create custom account form
  const [createCode, setCreateCode] = useState('');
  const [createName, setCreateName] = useState('');
  const [createParent, setCreateParent] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Override label form
  const [labelCode, setLabelCode] = useState('');
  const [labelName, setLabelName] = useState('');
  const [labelError, setLabelError] = useState<string | null>(null);
  const [labelSuccess, setLabelSuccess] = useState<string | null>(null);

  // Note form
  const [noteCode, setNoteCode] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteSuccess, setNoteSuccess] = useState<string | null>(null);

  // Lookup
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<Account | null>(null);
  const [lookupNote, setLookupNote] = useState<string | null>(null);

  // Snapshot
  const [snapshotJson, setSnapshotJson] = useState('');
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    if (!book.isInitialized()) return;
    setStats(await book.getStats());
  }, []);

  useEffect(() => {
    book.initialize().then(() => {
      setInitialized(true);
      refreshStats();
    });
  }, [refreshStats]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    const result = await book.createAccount({
      code: createCode.trim(),
      name: createName.trim(),
      parentCode: createParent.trim(),
    });
    if (result.ok) {
      setCreateSuccess(`Created account ${result.data.code}: ${result.data.name}`);
      setCreateCode('');
      setCreateName('');
      setCreateParent('');
    } else {
      setCreateError(result.error.message);
    }
    refreshStats();
  }

  async function handleLabel(e: React.FormEvent) {
    e.preventDefault();
    setLabelError(null);
    setLabelSuccess(null);
    const result = await book.updateLabel(labelCode.trim(), labelName.trim());
    if (result.ok) {
      setLabelSuccess(`Updated label for ${result.data.code}`);
      setLabelCode('');
      setLabelName('');
    } else {
      setLabelError(result.error.message);
    }
    refreshStats();
  }

  async function handleNote(e: React.FormEvent) {
    e.preventDefault();
    setNoteError(null);
    setNoteSuccess(null);
    try {
      await book.setNote(noteCode.trim(), noteText.trim());
      setNoteSuccess(`Note saved for account ${noteCode.trim()}`);
      setNoteCode('');
      setNoteText('');
      refreshStats();
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : 'Failed to save note');
    }
  }

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const acc = book.getAccountOrNull(lookupCode.trim());
    setLookupResult(acc);
    if (acc) {
      book.getNote(acc.code).then(setLookupNote).catch(() => setLookupNote(null));
    } else {
      setLookupNote(null);
    }
  }

  async function handleSnapshot() {
    const snap = await book.snapshot();
    setSnapshotJson(JSON.stringify(snap, null, 2));
    setRestoreError(null);
    setRestoreSuccess(null);
  }

  async function handleRestore() {
    setRestoreError(null);
    setRestoreSuccess(null);
    try {
      const snap: AccountBookSnapshot = JSON.parse(snapshotJson);
      const result = await book.restore(snap);
      if (result.ok) {
        setRestoreSuccess('Restored successfully');
      } else {
        setRestoreError(result.error.message);
      }
      refreshStats();
    } catch (err) {
      setRestoreError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }

  if (!initialized) {
    return <div className="text-sm text-gray-400">Initializing...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">AccountBook</h1>
      <p className="mt-2 text-gray-600">
        Unified facade — official + custom accounts, label overrides, notes, export, snapshot/restore.
      </p>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Accounts</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.customAccountCount}</p>
            <p className="text-sm text-gray-500">Custom Accounts</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.labelOverrideCount}</p>
            <p className="text-sm text-gray-500">Label Overrides</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.noteCount}</p>
            <p className="text-sm text-gray-500">Notes</p>
          </div>
        </div>
      )}

      {/* Create Custom Account */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Create Custom Account</h2>
        <p className="text-sm text-gray-500 mb-3">
          Code must be 3+ characters, start with the parent code, and use alphanumeric characters or hyphens.
        </p>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-2">
          <input
            type="text"
            value={createParent}
            onChange={e => setCreateParent(e.target.value)}
            placeholder="Parent code (e.g. 411)"
            className={`w-44 ${inputClass}`}
          />
          <input
            type="text"
            value={createCode}
            onChange={e => setCreateCode(e.target.value)}
            placeholder="New code (e.g. 411-VIP)"
            className={`w-44 ${inputClass}`}
          />
          <input
            type="text"
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            placeholder="Account name"
            className={`flex-1 min-w-48 ${inputClass}`}
          />
          <button type="submit" className={btnPrimary}>
            Create
          </button>
        </form>
        {createError && (
          <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {createError}
          </div>
        )}
        {createSuccess && (
          <div className="mt-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {createSuccess}
          </div>
        )}
      </div>

      {/* Override Label */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Override Account Label</h2>
        <p className="text-sm text-gray-500 mb-3">
          Change the display name of any 3+ character account (official or custom).
        </p>
        <form onSubmit={handleLabel} className="flex gap-2">
          <input
            type="text"
            value={labelCode}
            onChange={e => setLabelCode(e.target.value)}
            placeholder="Account code (e.g. 4111)"
            className={`w-44 ${inputClass}`}
          />
          <input
            type="text"
            value={labelName}
            onChange={e => setLabelName(e.target.value)}
            placeholder="New label"
            className={`flex-1 ${inputClass}`}
          />
          <button type="submit" className={btnPrimary}>
            Override
          </button>
        </form>
        {labelError && (
          <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {labelError}
          </div>
        )}
        {labelSuccess && (
          <div className="mt-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {labelSuccess}
          </div>
        )}
      </div>

      {/* Set Note */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Set Note</h2>
        <p className="text-sm text-gray-500 mb-3">
          Attach a note to any official or custom account.
        </p>
        <form onSubmit={handleNote} className="flex gap-2">
          <input
            type="text"
            value={noteCode}
            onChange={e => setNoteCode(e.target.value)}
            placeholder="Account code (e.g. 5121)"
            className={`w-44 ${inputClass}`}
          />
          <input
            type="text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Note text"
            className={`flex-1 ${inputClass}`}
          />
          <button type="submit" className={btnPrimary}>
            Save Note
          </button>
        </form>
        {noteError && (
          <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {noteError}
          </div>
        )}
        {noteSuccess && (
          <div className="mt-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {noteSuccess}
          </div>
        )}
      </div>

      {/* Merged Lookup */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Merged Lookup (Official + Custom)</h2>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupCode}
            onChange={e => setLookupCode(e.target.value)}
            placeholder="Account code"
            className={`w-44 ${inputClass}`}
          />
          <button type="submit" className={btnSecondary}>
            Lookup
          </button>
        </form>
        {lookupResult && (
          <div className="mt-3 bg-white rounded-lg border border-gray-200 p-4 text-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <div><span className="text-gray-500">Code:</span> <span className="font-mono font-medium">{lookupResult.code}</span></div>
              <div><span className="text-gray-500">Name:</span> {lookupResult.name}</div>
              <div><span className="text-gray-500">Level:</span> {lookupResult.level}</div>
              <div><span className="text-gray-500">Class:</span> {lookupResult.classCode}</div>
              <div><span className="text-gray-500">Parent:</span> <span className="font-mono">{lookupResult.parentCode ?? 'none'}</span></div>
              <div>
                <span className="text-gray-500">Custom:</span>{' '}
                {lookupResult.metadata?.tags?.includes('custom') ? (
                  <span className="text-blue-600 font-medium">Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </div>
            </div>
            {lookupNote && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-gray-500">Note:</span>{' '}
                <span className="text-blue-600">{lookupNote}</span>
              </div>
            )}
          </div>
        )}
        {lookupCode && !lookupResult && (
          <p className="mt-3 text-sm text-gray-400">No account found for "{lookupCode}"</p>
        )}
      </div>

      {/* Snapshot / Restore */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Snapshot / Restore</h2>
        <p className="text-sm text-gray-500 mb-3">
          Capture the full book state (custom accounts, label overrides, notes) as JSON. Edit and restore.
        </p>
        <div className="flex gap-2 mb-3">
          <button className={btnPrimary} onClick={handleSnapshot}>
            Take Snapshot
          </button>
          <button
            className={btnSecondary}
            onClick={handleRestore}
            disabled={!snapshotJson}
          >
            Restore
          </button>
        </div>
        {restoreError && (
          <div className="mb-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {restoreError}
          </div>
        )}
        {restoreSuccess && (
          <div className="mb-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {restoreSuccess}
          </div>
        )}
        {snapshotJson && (
          <textarea
            className={`w-full h-48 font-mono text-xs ${inputClass}`}
            value={snapshotJson}
            onChange={e => setSnapshotJson(e.target.value)}
          />
        )}
      </div>

      {/* Code Example */}
      <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Code Example</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          <code>{`import { AccountBook, MemoryStorage } from 'ohadakit';

const book = new AccountBook({ storage: new MemoryStorage() });
await book.initialize();

// Access any account (official + custom)
const account = book.getAccountOrNull('411');

// Create custom, override labels, attach notes
await book.createAccount({ code: '411-VIP', name: 'Clients VIP', parentCode: '411' });
await book.updateLabel('4111', 'Clients - Particuliers');
await book.setNote('411-VIP', 'High-value clients');

// Snapshot / restore
const snap = await book.snapshot();
await book.restore(snap);`}</code>
        </pre>
      </div>
    </div>
  );
}
