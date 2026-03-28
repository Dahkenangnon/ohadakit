import { JsonExporter, CsvExporter } from '../../src/export/Exporter';
import { AccountRegistry, getDefaultRegistry, resetDefaultRegistry } from '../../src/core/AccountRegistry';
import { Account } from '../../src/core/Account';
import type { RawAccountData } from '../../src/core/types';

describe('JsonExporter', () => {
  let registry: AccountRegistry;

  beforeAll(() => {
    resetDefaultRegistry();
    registry = getDefaultRegistry();
  });

  describe('Flat structure', () => {
    test('output is a flat array with expected fields', () => {
      const accounts = registry.getByClass('4').slice(0, 5);
      const json = JsonExporter.export(accounts, { structure: 'flat', pretty: false });
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(5);
      parsed.forEach((item: any) => {
        expect(item).toHaveProperty('code');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('level');
        expect(item).toHaveProperty('classCode');
      });
    });

    test('pretty: false produces single-line JSON', () => {
      const accounts = registry.getByClass('4').slice(0, 2);
      const json = JsonExporter.export(accounts, { structure: 'flat', pretty: false });
      expect(json.split('\n').length).toBe(1);
    });

    test('pretty: true produces indented JSON', () => {
      const accounts = registry.getByClass('4').slice(0, 2);
      const json = JsonExporter.export(accounts, { structure: 'flat', pretty: true });
      expect(json.split('\n').length).toBeGreaterThan(1);
    });
  });

  describe('Hierarchical structure', () => {
    test('level-2 roots appear at top level with nested children', () => {
      const accounts = registry.getByClass('4');
      const json = JsonExporter.export(accounts, { structure: 'hierarchical' });
      const parsed = JSON.parse(json);

      // OHADA data has no level-1 class accounts; level-2 accounts are roots
      expect(parsed.length).toBeGreaterThan(0);
      // All roots should be level-2 accounts with no parent in this subset
      const rootCodes = parsed.map((n: any) => n.code);
      expect(rootCodes.some((c: string) => c === '40' || c === '41')).toBe(true);

      // Find a root that has children
      const rootWithChildren = parsed.find((n: any) => n.children.length > 0);
      expect(rootWithChildren).toBeDefined();
      rootWithChildren.children.forEach((child: any) => {
        expect(child.classCode).toBe('4');
      });
    });

    test('orphaned accounts (missing parent in subset) appear at root level', () => {
      // Export a subset that skips the parent
      const account = registry.getByCode('4111')!;
      const json = JsonExporter.export([account], { structure: 'hierarchical' });
      const parsed = JSON.parse(json);

      // 4111 has parent 411, which isn't in the subset, so 4111 appears at root
      expect(parsed.length).toBe(1);
      expect(parsed[0].code).toBe('4111');
    });
  });

  describe('Empty accounts', () => {
    test('empty array → JSON returns []', () => {
      const json = JsonExporter.export([], { structure: 'flat' });
      expect(JSON.parse(json)).toEqual([]);
    });

    test('empty array hierarchical → JSON returns []', () => {
      const json = JsonExporter.export([], { structure: 'hierarchical' });
      expect(JSON.parse(json)).toEqual([]);
    });
  });
});

describe('CsvExporter', () => {
  let registry: AccountRegistry;

  beforeAll(() => {
    resetDefaultRegistry();
    registry = getDefaultRegistry();
  });

  describe('Basic CSV output', () => {
    test('default columns include code, name, level, classCode', () => {
      const accounts = registry.getByClass('4').slice(0, 3);
      const csv = CsvExporter.export(accounts);
      const lines = csv.split('\n');

      // Header line
      expect(lines[0]).toContain('code');
      expect(lines[0]).toContain('name');
      // Data lines
      expect(lines.length).toBe(4); // 1 header + 3 data
    });

    test('includeHeader: false skips header row', () => {
      const accounts = registry.getByClass('4').slice(0, 3);
      const csv = CsvExporter.export(accounts, { includeHeader: false });
      const lines = csv.split('\n');
      expect(lines.length).toBe(3); // Just data rows
    });
  });

  describe('Column selection', () => {
    test('columns: ["code", "name"] outputs exactly 2 columns', () => {
      const accounts = registry.getByClass('4').slice(0, 2);
      const csv = CsvExporter.export(accounts, {
        columns: ['code', 'name']
      });
      const lines = csv.split('\n');
      // Header should have exactly 2 fields
      expect(lines[0]!.split(',').length).toBe(2);
    });

    test('columns: ["path"] uses pathString', () => {
      const account = registry.getByCode('4111')!;
      const csv = CsvExporter.export([account], {
        columns: ['path'],
        includeHeader: false
      });
      // OHADA data starts at level 2, path is "41 > 411 > 4111"
      expect(csv).toContain('41 > 411 > 4111');
    });
  });

  describe('CSV escaping', () => {
    test('value containing comma is wrapped in quotes', () => {
      const account = Account.fromRawData({
        code: '999',
        name: 'Provision, diverse',
        level: 3,
        classCode: '9',
        parentCode: '99',
      });
      const csv = CsvExporter.export([account], {
        columns: ['name'],
        includeHeader: false,
      });
      expect(csv).toBe('"Provision, diverse"');
    });

    test('value containing quote has quotes doubled', () => {
      const account = Account.fromRawData({
        code: '999',
        name: 'Provision "speciale"',
        level: 3,
        classCode: '9',
        parentCode: '99',
      });
      const csv = CsvExporter.export([account], {
        columns: ['name'],
        includeHeader: false,
      });
      expect(csv).toBe('"Provision ""speciale"""');
    });

    test('value containing newline is wrapped in quotes', () => {
      const account = Account.fromRawData({
        code: '999',
        name: 'Line1\nLine2',
        level: 3,
        classCode: '9',
        parentCode: '99',
      });
      const csv = CsvExporter.export([account], {
        columns: ['name'],
        includeHeader: false,
      });
      expect(csv).toBe('"Line1\nLine2"');
    });

    test('custom delimiter ";" — commas in values are not escaped', () => {
      const account = Account.fromRawData({
        code: '999',
        name: 'Provision, diverse',
        level: 3,
        classCode: '9',
        parentCode: '99',
      });
      const csv = CsvExporter.export([account], {
        columns: ['name'],
        includeHeader: false,
        delimiter: ';',
      });
      // With ; delimiter, comma doesn't trigger escaping
      expect(csv).toBe('Provision, diverse');
    });
  });

  describe('Empty accounts', () => {
    test('empty array with header → just header line', () => {
      const csv = CsvExporter.export([], { columns: ['code', 'name'] });
      const lines = csv.split('\n');
      expect(lines.length).toBe(1);
      expect(lines[0]).toBe('code,name');
    });

    test('empty array without header → empty string', () => {
      const csv = CsvExporter.export([], {
        columns: ['code', 'name'],
        includeHeader: false,
      });
      expect(csv).toBe('');
    });
  });
});
