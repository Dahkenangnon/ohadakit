import { useState } from 'react';
import { ledger } from '../lib/sdk';
import { OHADA_CLASSES } from 'ohadakit';

const classes = Object.values(OHADA_CLASSES);

export default function ClassBrowser() {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedMain, setExpandedMain] = useState<string | null>(null);

  const stats = ledger.getStats();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Class Browser</h1>
      <p className="mt-2 text-gray-600">
        Navigate the 9 OHADA classes and their account hierarchies.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {classes.map(cls => {
          const classAccounts = stats.byClass[cls.code] ?? 0;
          const isExpanded = expandedClass === cls.code;

          return (
            <div key={cls.code} className="col-span-1">
              <button
                onClick={() => {
                  setExpandedClass(isExpanded ? null : cls.code);
                  setExpandedMain(null);
                }}
                className={`w-full text-left rounded-lg border p-4 transition-all ${
                  isExpanded
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-blue-600">{cls.code}</span>
                  <span className="text-xs text-gray-400">{classAccounts} accounts</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1">{cls.name}</p>
                <p className="text-xs text-gray-500">{cls.nameEn}</p>
              </button>
            </div>
          );
        })}
      </div>

      {expandedClass && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">
            Class {expandedClass} — Main Accounts
          </h2>
          <div className="space-y-1">
            {ledger.registry.getByClass(expandedClass)
              .filter(a => a.level === 2)
              .map(mainAcc => {
                const isMainExpanded = expandedMain === mainAcc.code;
                const children = mainAcc.children;

                return (
                  <div key={mainAcc.code}>
                    <button
                      onClick={() => setExpandedMain(isMainExpanded ? null : mainAcc.code)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                        isMainExpanded
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-xs transition-transform ${isMainExpanded ? 'rotate-90' : ''}`}>
                        {children.length > 0 ? '▶' : '•'}
                      </span>
                      <span className="font-mono w-10">{mainAcc.code}</span>
                      <span className="flex-1">{mainAcc.name}</span>
                      {children.length > 0 && (
                        <span className="text-xs text-gray-400">{children.length}</span>
                      )}
                    </button>

                    {isMainExpanded && children.length > 0 && (
                      <div className="ml-8 mt-1 space-y-0.5 mb-2">
                        {children.map(child => (
                          <div
                            key={child.code}
                            className="px-3 py-1.5 text-sm flex gap-3 text-gray-600"
                          >
                            <span className="font-mono w-12 text-gray-400">{child.code}</span>
                            <span>{child.name}</span>
                            {child.children.length > 0 && (
                              <span className="text-xs text-gray-300 ml-auto">
                                +{child.children.length}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
