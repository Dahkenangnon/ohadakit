import { useState, useEffect, useCallback } from 'react';
import { ledger } from '../lib/sdk';
import CodeBlock from '../CodeBlock';

interface NoteEntry {
  code: string;
  name: string;
  note: string;
}

export default function Notes() {
  const [code, setCode] = useState('');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refreshNotes = useCallback(async () => {
    const allNotes = await ledger.getAllNotes();
    const entries: NoteEntry[] = [];
    allNotes.forEach((note, noteCode) => {
      const account = ledger.getOrNull(noteCode);
      entries.push({
        code: noteCode,
        name: account?.name ?? 'Unknown',
        note,
      });
    });
    entries.sort((a, b) => a.code.localeCompare(b.code));
    setNotes(entries);
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedCode = code.trim();
    const trimmedNote = noteText.trim();
    if (!trimmedCode || !trimmedNote) return;

    try {
      await ledger.setNote(trimmedCode, trimmedNote);
      setSuccess(`Note saved for account ${trimmedCode}`);
      setCode('');
      setNoteText('');
      await refreshNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    }
  }

  async function handleDelete(noteCode: string) {
    await ledger.deleteNote(noteCode);
    await refreshNotes();
  }

  async function handleClearAll() {
    await ledger.clearAllNotes();
    await refreshNotes();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Notes & Storage</h1>
      <p className="mt-2 text-gray-600">
        Attach notes to any account using the pluggable storage adapter.
        This demo uses the default in-memory storage.
      </p>

      <form onSubmit={handleAdd} className="mt-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Account code (e.g. 5121)"
            className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Note text (e.g. Mobile Money Orange)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Save Note
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">
            Saved Notes ({notes.length})
          </h2>
          {notes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-400">
            No notes yet. Add a note to an account above.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {notes.map(entry => (
              <div key={entry.code} className="px-4 py-3 flex items-start gap-4">
                <div className="shrink-0">
                  <span className="font-mono text-sm text-gray-500">{entry.code}</span>
                  <p className="text-xs text-gray-400">{entry.name}</p>
                </div>
                <p className="flex-1 text-sm text-gray-700">{entry.note}</p>
                <button
                  onClick={() => handleDelete(entry.code)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Code Example</h3>
        <CodeBlock code={`import { LedgerEngine, MemoryStorage, LocalStorageAdapter } from 'ohadakit';

// In-memory storage (default)
const ledger = new LedgerEngine();

// Or browser localStorage
const ledger = new LedgerEngine({
  storage: new LocalStorageAdapter('myapp:')
});

await ledger.setNote('5121', 'Mobile Money Orange');
await ledger.getNote('5121');    // 'Mobile Money Orange'
await ledger.deleteNote('5121');
await ledger.getAllNotes();      // Map<string, string>`} />
      </div>
    </div>
  );
}
