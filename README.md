<div align="center">

# OhadaKit

**Production-ready TypeScript SDK for the OHADA/SYSCOHADA accounting chart of accounts**

[![npm version](https://img.shields.io/npm/v/ohadakit.svg)](https://www.npmjs.com/package/ohadakit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#core-api) · [GitHub](https://github.com/Dahkenangnon/ohadakit)

</div>

---

## Features

- **Complete OHADA Chart** — All 1000+ accounts across 9 classes
- **O(1) Lookups** — Map-based indexes and Trie prefix search for instant retrieval
- **Type-Safe** — Full TypeScript support with branded types and `Result<T, E>` pattern
- **Query Builder** — Fluent API with filters, fuzzy search, and sorting
- **i18n** — Localized account names in French, English, Portuguese, and Spanish
- **Custom Accounts** — Overlay pattern for creating custom sub-accounts and overriding labels
- **Pluggable Storage** — Attach notes with any storage backend (memory, localStorage, custom)
- **Export** — JSON (flat/hierarchical) and CSV output formats
- **Zero Dependencies** — Core SDK has no external dependencies

## Installation

```bash
npm install ohadakit
```

## Quick Start

```typescript
import { LedgerEngine } from 'ohadakit';

const ledger = new LedgerEngine();

// Get an account (Result type — explicit error handling)
const result = ledger.get('4111');
if (result.ok) {
  console.log(result.data.name);       // "Clients"
  console.log(result.data.pathString); // "41 > 411 > 4111"
}

// Or use convenience accessors
const account = ledger.getOrNull('4111');  // Account | null
const account2 = ledger.getOrThrow('411'); // Account (throws on error)

// Query builder
const expenses = ledger.query()
  .inClass('6')
  .atLevel(3)
  .nameContains('personnel')
  .sortBy('code', 'asc')
  .execute();
```

## Core API

### Account Access

```typescript
ledger.get('4111')           // Result<Account> with validation
ledger.getOrNull('4111')     // Account | null
ledger.getOrThrow('4111')    // Account (throws on error)

// Direct registry access
ledger.registry.has('4111')       // boolean
ledger.registry.getByClass('4')   // Account[]
ledger.registry.getByLevel(3)     // Account[]
ledger.registry.searchByPrefix('41') // Account[] (Trie-based)
```

### Query Builder

```typescript
ledger.query()
  .inClass(['4', '5'])       // Filter by class(es)
  .atLevel([3, 4])           // Filter by level(s)
  .withParent('41')          // Filter by parent
  .nameContains('client')    // Search in name
  .codeMatches(/^6[0-3]/)    // Regex pattern
  .where(acc => acc.isLeaf)  // Custom predicate
  .sortBy('code', 'asc')     // Sort results
  .offset(10).limit(20)      // Pagination
  .execute();                // Get Account[]

// Convenience methods
ledger.query().inClass('4').count();   // number
ledger.query().inClass('4').first();   // Account | null
ledger.query().inClass('4').exists();  // boolean

// Fuzzy search
ledger.query()
  .search('cliens', { fuzzy: true, threshold: 0.6 })
  .execute();
```

### Account Relationships

```typescript
const account = ledger.getOrThrow('4111');

account.parent      // Account | null
account.children    // Account[]
account.ancestors   // Account[] (nearest parent first)
account.siblings    // Account[]
account.path        // Account[] (root to self)
account.pathString  // "41 > 411 > 4111"
account.isLeaf      // boolean
account.isRoot      // boolean
account.depth       // number

account.isDescendantOf('4')     // true
account.isAncestorOf('41111')   // true (if exists)
account.getDescendants()        // Account[]
account.getDescendantsAtLevel(2) // grandchildren only
```

### Internationalization (i18n)

Supports 4 OHADA locales: French (fr), English (en), Portuguese (pt), Spanish (es).

```typescript
// Set locale at creation
const ledger = new LedgerEngine({ locale: 'en' });

// Or change later
ledger.setLocale('en');
ledger.getLocale();              // 'en'
ledger.getAvailableLocales();    // ['fr', 'en', 'pt', 'es']

// Get localized account name (falls back to French if translation missing)
ledger.getLocalizedName('4111'); // English name or French fallback

// Direct TranslationService access
ledger.i18n.getAccountName('10', 'Capital');
ledger.i18n.hasTranslation('10');
```

### Custom Accounts

Extend the immutable OHADA chart with custom sub-accounts and label overrides.

```typescript
import { CustomAccountManager, MemoryStorage } from 'ohadakit';

const manager = new CustomAccountManager({
  storage: new MemoryStorage()
});
await manager.initialize();

// Create a custom sub-account (3+ characters, must start with parent code)
const result = await manager.createAccount({
  code: '411-VIP',
  name: 'Clients VIP',
  parentCode: '411'
});

// Override label of an existing account
await manager.updateLabel('4111', 'Clients - Particuliers');

// Query custom + official accounts together
manager.getByCode('411-VIP');   // Account
manager.getAll();               // All official + custom accounts
manager.getCustomAccounts();    // Only custom accounts
```

### AccountBook (Unified Facade)

`AccountBook` wraps all OhadaKit features into a single entry point: official accounts, custom accounts, label overrides, notes, i18n, and export — with snapshot/restore for state management.

```typescript
import { AccountBook, MemoryStorage } from 'ohadakit';

const book = new AccountBook({ storage: new MemoryStorage() });
await book.initialize();

// Access any account (official + custom, with label overrides applied)
const account = book.getAccountOrNull('411');

// Create custom sub-accounts
await book.createAccount({ code: '411-VIP', name: 'Clients VIP', parentCode: '411' });

// Override labels
await book.updateLabel('4111', 'Clients - Particuliers');

// Notes work on both official and custom accounts
await book.setNote('411-VIP', 'High-value clients');

// Export merged data (official + custom + overrides)
const json = book.exportToJSON({ pretty: true });
const csv = book.exportToCSV();

// i18n
book.setLocale('en');
book.getLocalizedName('10'); // English name

// Stats
const stats = await book.getStats();
// { total, byClass, byLevel, customAccountCount, labelOverrideCount, noteCount }
```

#### Snapshot / Restore

Capture and restore the entire book state (custom accounts, label overrides, notes) as a plain JSON object:

```typescript
// Take a snapshot
const snapshot = await book.snapshot();
// { version, timestamp, locale, customAccounts, labelOverrides, notes }

// Store it anywhere (database, file, API)
const json = JSON.stringify(snapshot);

// Restore into a fresh or existing book
const result = await book.restore(JSON.parse(json));
if (!result.ok) {
  console.error('Restore failed:', result.error.message);
}
```

#### When to use AccountBook vs LedgerEngine

| Use case | Recommendation |
|----------|---------------|
| Quick lookups on official accounts only | `LedgerEngine` |
| Custom accounts + label overrides + notes | `AccountBook` |
| App needs snapshot/restore of chart state | `AccountBook` |
| Prototype without persistence wiring | `LedgerEngine` |

### Notes Storage

```typescript
import { LedgerEngine, LocalStorageAdapter } from 'ohadakit';

// In-memory (default)
const ledger = new LedgerEngine();

// Browser localStorage
const ledger = new LedgerEngine({
  storage: new LocalStorageAdapter('myapp:')
});

await ledger.setNote('5121', 'Mobile Money Orange');
await ledger.getNote('5121');    // 'Mobile Money Orange'
await ledger.deleteNote('5121');
await ledger.hasNote('5121');    // false
await ledger.getAllNotes();      // Map<string, string>
```

### Export

```typescript
// JSON (flat or hierarchical)
ledger.exportToJSON({ structure: 'flat', pretty: true });
ledger.exportToJSON({ structure: 'hierarchical' });

// CSV
ledger.exportToCSV({ columns: ['code', 'name', 'level'] });
ledger.exportToCSV({ delimiter: ';', includeHeader: true });

// Export specific class
ledger.exportClass('4', 'json', { structure: 'flat' });
ledger.exportClass('4', 'csv', { columns: ['code', 'name'] });
```

### Validation

```typescript
import { validateAccountCodeFormat, AccountNotFoundError } from 'ohadakit';

// Format validation (no registry lookup)
const formatResult = validateAccountCodeFormat('4111'); // Result<string>

// Full validation with Result type
const result = ledger.get('9999');
if (!result.ok && result.error instanceof AccountNotFoundError) {
  console.error(result.error.message);
}

// Batch validation
const { valid, invalid } = ledger.validateBatch(['4111', '5121', '9999']);
// valid: [{ code: '4111', account }, { code: '5121', account }]
// invalid: [{ code: '9999', error }]
```

## Using OhadaKit in an Accounting App

OhadaKit manages the **chart of accounts** — it does not own journal entries, balances, or transactions. Your app links to OhadaKit via account codes used as foreign keys.

```
┌──────────────────────────┐     ┌──────────────────────────┐
│       Your App           │     │       OhadaKit           │
│                          │     │                          │
│  Journal Entries ────────┼─FK──▶  AccountBook             │
│  Balances ───────────────┼─FK──▶    ├─ Official Accounts  │
│  Trial Balance ──────────┼─FK──▶    ├─ Custom Accounts    │
│  Financial Statements    │     │    ├─ Label Overrides    │
│                          │     │    ├─ Notes              │
│  Your DB / API           │     │    └─ i18n + Export      │
└──────────────────────────┘     └──────────────────────────┘
```

### Step-by-step Integration

```typescript
import { AccountBook, MemoryStorage } from 'ohadakit';

// 1. Initialize the book
const book = new AccountBook({ storage: new MemoryStorage() });
await book.initialize();

// 2. Validate account codes when creating journal entries
function addJournalEntry(debitCode: string, creditCode: string, amount: number) {
  if (!book.has(debitCode)) throw new Error(`Unknown account: ${debitCode}`);
  if (!book.has(creditCode)) throw new Error(`Unknown account: ${creditCode}`);

  // Store in your database with account codes as FKs
  return { debitCode, creditCode, amount, date: new Date() };
}

// 3. Resolve names for display
function getAccountName(code: string): string {
  return book.getAccountOrNull(code)?.name ?? `Unknown (${code})`;
}

// 4. Save/restore chart state alongside your app data
async function saveAppState(db: any) {
  const snapshot = await book.snapshot();
  await db.put('chart-state', JSON.stringify(snapshot));
}
```

### What OhadaKit Owns vs What Your App Owns

| Concern | Owner |
|---------|-------|
| Chart of accounts (official 1000+ accounts) | OhadaKit |
| Custom sub-accounts & label overrides | OhadaKit (via AccountBook) |
| Notes attached to accounts | OhadaKit (via AccountBook) |
| Account name translations (fr/en/pt/es) | OhadaKit |
| Journal entries, postings | Your app |
| Account balances, trial balance | Your app |
| Financial statements | Your app |
| User authentication, permissions | Your app |

## OHADA Structure

```
Level 1: Class (1-9)
  └─ Level 2: Main account (10, 11...)
      └─ Level 3: Sub-account (101, 102...)
          └─ Level 4: Detail account (1011, 1012...)
```

| Class | Description |
|-------|-------------|
| 1 | Comptes de ressources durables |
| 2 | Comptes d'actif immobilise |
| 3 | Comptes de stocks |
| 4 | Comptes de tiers |
| 5 | Comptes de tresorerie |
| 6 | Comptes de charges des activites ordinaires |
| 7 | Comptes de produits des activites ordinaires |
| 8 | Comptes des autres charges et autres produits |
| 9 | Comptes des engagements hors bilan |

## License

MIT © [@Dahkenangnon](https://github.com/Dahkenangnon)

---

<div align="center">

**[GitHub](https://github.com/Dahkenangnon/ohadakit)** · **[Issues](https://github.com/Dahkenangnon/ohadakit/issues)** · **[npm](https://www.npmjs.com/package/ohadakit)**

Questions or feedback? Reach out at **dah.kenangnon@gmail.com**

</div>
