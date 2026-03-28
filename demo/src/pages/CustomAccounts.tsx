import { useState, useEffect, useCallback } from 'react';
import { CustomAccountManager, MemoryStorage } from 'ohadakit';
import type { Account, CustomAccountData, LabelOverride } from 'ohadakit';

const manager = new CustomAccountManager({ storage: new MemoryStorage() });

export default function CustomAccounts() {
  const [initialized, setInitialized] = useState(false);
  const [customAccounts, setCustomAccounts] = useState<CustomAccountData[]>([]);
  const [labelOverrides, setLabelOverrides] = useState<LabelOverride[]>([]);

  // Create form
  const [createCode, setCreateCode] = useState('');
  const [createName, setCreateName] = useState('');
  const [createParent, setCreateParent] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Label override form
  const [labelCode, setLabelCode] = useState('');
  const [labelName, setLabelName] = useState('');
  const [labelError, setLabelError] = useState<string | null>(null);
  const [labelSuccess, setLabelSuccess] = useState<string | null>(null);

  // Lookup
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<Account | null>(null);

  const refresh = useCallback(() => {
    setCustomAccounts(manager.getCustomAccountData());
    setLabelOverrides(manager.getLabelOverrides());
  }, []);

  useEffect(() => {
    manager.initialize().then(() => {
      setInitialized(true);
      refresh();
    });
  }, [refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    const result = await manager.createAccount({
      code: createCode.trim(),
      name: createName.trim(),
      parentCode: createParent.trim(),
    });

    if (result.ok) {
      setCreateSuccess(`Created account ${result.data.code}: ${result.data.name}`);
      setCreateCode('');
      setCreateName('');
      setCreateParent('');
      refresh();
    } else {
      setCreateError(result.error.message);
    }
  }

  async function handleUpdateLabel(e: React.FormEvent) {
    e.preventDefault();
    setLabelError(null);
    setLabelSuccess(null);

    const result = await manager.updateLabel(labelCode.trim(), labelName.trim());

    if (result.ok) {
      setLabelSuccess(`Updated label for ${result.data.code}`);
      setLabelCode('');
      setLabelName('');
      refresh();
    } else {
      setLabelError(result.error.message);
    }
  }

  async function handleDelete(code: string) {
    const result = await manager.deleteCustomAccount(code);
    if (result.ok) {
      refresh();
    }
  }

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const account = manager.getByCode(lookupCode.trim());
    setLookupResult(account);
  }

  if (!initialized) {
    return <div className="text-sm text-gray-400">Initializing...</div>;
  }

  const stats = manager.getStats();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Custom Accounts</h1>
      <p className="mt-2 text-gray-600">
        Extend the immutable OHADA chart with custom sub-accounts and label overrides.
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.customAccountCount}</p>
          <p className="text-sm text-gray-500">Custom Accounts</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.labelOverrideCount}</p>
          <p className="text-sm text-gray-500">Label Overrides</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{manager.getTotalCount()}</p>
          <p className="text-sm text-gray-500">Total Accounts</p>
        </div>
      </div>

      {/* Create custom account */}
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
            className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            value={createCode}
            onChange={e => setCreateCode(e.target.value)}
            placeholder="New code (e.g. 411-VIP)"
            className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            placeholder="Account name"
            className="flex-1 min-w-48 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
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

      {/* Label override */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Override Account Label</h2>
        <p className="text-sm text-gray-500 mb-3">
          Change the display name of any 3+ character account (official or custom).
        </p>
        <form onSubmit={handleUpdateLabel} className="flex gap-2">
          <input
            type="text"
            value={labelCode}
            onChange={e => setLabelCode(e.target.value)}
            placeholder="Account code (e.g. 4111)"
            className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            value={labelName}
            onChange={e => setLabelName(e.target.value)}
            placeholder="New label"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
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

      {/* Lookup in merged view */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-3">Lookup (Official + Custom)</h2>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupCode}
            onChange={e => setLookupCode(e.target.value)}
            placeholder="Account code"
            className="w-44 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
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
          </div>
        )}
        {lookupCode && !lookupResult && (
          <p className="mt-3 text-sm text-gray-400">No account found for "{lookupCode}"</p>
        )}
      </div>

      {/* Custom accounts list */}
      {customAccounts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-3">
            Custom Accounts ({customAccounts.length})
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {customAccounts.map(acc => (
              <div key={acc.code} className="px-4 py-2.5 flex items-center gap-4">
                <span className="font-mono text-sm text-gray-500 w-24">{acc.code}</span>
                <span className="text-sm flex-1">{acc.name}</span>
                <span className="text-xs text-gray-400">parent: {acc.parentCode}</span>
                <button
                  onClick={() => handleDelete(acc.code)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Label overrides list */}
      {labelOverrides.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-3">
            Label Overrides ({labelOverrides.length})
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {labelOverrides.map(ov => (
              <div key={ov.code} className="px-4 py-2.5 text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-gray-500 w-16">{ov.code}</span>
                  <span className="text-gray-400 line-through">{ov.originalName}</span>
                  <span className="text-gray-300">&rarr;</span>
                  <span className="font-medium">{ov.customName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
