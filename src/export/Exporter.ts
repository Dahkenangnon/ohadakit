/**
 * Export utilities for various formats (JSON, CSV)
 */

import type { Account } from '../core/Account';
import type {
  AccountJSON,
  JsonExportOptions,
  CsvExportOptions
} from '../core/types';
import { ExportError } from '../validation/errors';

interface HierarchicalNode extends AccountJSON {
  children: HierarchicalNode[];
}

/**
 * Export accounts to JSON format
 */
export class JsonExporter {
  static export(
    accounts: Account[],
    options: JsonExportOptions = {}
  ): string {
    try {
      const {
        structure = 'flat',
        pretty = true,
        includeNotes = false
      } = options;

      let data: AccountJSON[] | HierarchicalNode[];

      if (structure === 'hierarchical') {
        data = this.buildHierarchical(accounts);
      } else {
        data = accounts.map(acc => {
          const json = acc.toJSON();
          if (!includeNotes && json.metadata) {
            delete json.metadata;
          }
          return json;
        });
      }

      return pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
    } catch (error) {
      throw new ExportError('JSON', 'Failed to export to JSON', error as Error);
    }
  }

  private static buildHierarchical(accounts: Account[]): HierarchicalNode[] {
    const accountMap = new Map<string, HierarchicalNode>();
    const roots: HierarchicalNode[] = [];

    accounts.forEach(acc => {
      const json = acc.toJSON();
      accountMap.set(acc.code, {
        ...json,
        children: []
      });
    });

    accounts.forEach(acc => {
      const node = accountMap.get(acc.code)!;
      if (acc.parentCode) {
        const parent = accountMap.get(acc.parentCode);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}

type AccountJSONKey = keyof AccountJSON;

/**
 * Export accounts to CSV format
 */
export class CsvExporter {
  static export(
    accounts: Account[],
    options: CsvExportOptions = {}
  ): string {
    try {
      const {
        delimiter = ',',
        includeHeader = true,
        columns = ['code', 'name', 'level', 'classCode', 'parentCode', 'path'],
        includeNotes = false
      } = options;

      const lines: string[] = [];

      if (includeHeader) {
        const header = columns.map(col => this.escapeCSV(col, delimiter));
        if (includeNotes) {
          header.push(this.escapeCSV('notes', delimiter));
        }
        lines.push(header.join(delimiter));
      }

      accounts.forEach(acc => {
        const json = acc.toJSON();
        const row = columns.map(col => {
          let value: string | number;
          switch (col) {
            case 'path':
              value = json.pathString;
              break;
            case 'parentCode':
              value = json.parentCode ?? '';
              break;
            default:
              value = json[col as AccountJSONKey] as string | number ?? '';
          }
          return this.escapeCSV(String(value), delimiter);
        });

        if (includeNotes) {
          const note = json.metadata?.description ?? '';
          row.push(this.escapeCSV(note, delimiter));
        }

        lines.push(row.join(delimiter));
      });

      return lines.join('\n');
    } catch (error) {
      throw new ExportError('CSV', 'Failed to export to CSV', error as Error);
    }
  }

  private static escapeCSV(value: string, delimiter: string): string {
    if (
      value.includes(delimiter) ||
      value.includes('\n') ||
      value.includes('"')
    ) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
