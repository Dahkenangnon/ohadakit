import { useState, useMemo } from 'react';
import { ledger } from '../lib/sdk';

type Format = 'json' | 'csv';
type JsonStructure = 'flat' | 'hierarchical';

export default function Export() {
  const [format, setFormat] = useState<Format>('json');
  const [classFilter, setClassFilter] = useState('');
  const [jsonStructure, setJsonStructure] = useState<JsonStructure>('flat');
  const [jsonPretty, setJsonPretty] = useState(true);
  const [csvDelimiter, setCsvDelimiter] = useState(',');
  const [csvIncludeHeader, setCsvIncludeHeader] = useState(true);

  const output = useMemo(() => {
    if (format === 'json') {
      const opts = { structure: jsonStructure, pretty: jsonPretty };
      return classFilter
        ? ledger.exportClass(classFilter, 'json', opts)
        : ledger.exportToJSON(opts);
    } else {
      const opts = { delimiter: csvDelimiter, includeHeader: csvIncludeHeader };
      return classFilter
        ? ledger.exportClass(classFilter, 'csv', opts)
        : ledger.exportToCSV(opts);
    }
  }, [format, classFilter, jsonStructure, jsonPretty, csvDelimiter, csvIncludeHeader]);

  const previewLines = output.split('\n').slice(0, 50).join('\n');
  const totalLines = output.split('\n').length;

  function handleDownload() {
    const ext = format === 'json' ? 'json' : 'csv';
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ohadakit-export${classFilter ? `-class${classFilter}` : ''}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Export</h1>
      <p className="mt-2 text-gray-600">
        Export accounts as JSON or CSV with customizable options.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 items-start">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Format</label>
            <div className="flex gap-1">
              {(['json', 'csv'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase transition-colors ${
                    format === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Class Filter</label>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm w-full"
            >
              <option value="">All Classes</option>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          {format === 'json' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Structure</label>
                <div className="flex gap-1">
                  {(['flat', 'hierarchical'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setJsonStructure(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                        jsonStructure === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={jsonPretty}
                  onChange={e => setJsonPretty(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Pretty print
              </label>
            </>
          )}

          {format === 'csv' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Delimiter</label>
                <div className="flex gap-1">
                  {[{ label: 'Comma', value: ',' }, { label: 'Semicolon', value: ';' }, { label: 'Tab', value: '\t' }].map(d => (
                    <button
                      key={d.value}
                      onClick={() => setCsvDelimiter(d.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        csvDelimiter === d.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={csvIncludeHeader}
                  onChange={e => setCsvIncludeHeader(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Include header row
              </label>
            </>
          )}

          <button
            onClick={handleDownload}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Download .{format}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Preview</span>
            <span className="text-xs text-gray-400">
              {totalLines} lines{totalLines > 50 ? ' (showing first 50)' : ''}
            </span>
          </div>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-[600px]">
            <code>{previewLines}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
