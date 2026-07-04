import { TableColumn } from './table-column';
import { TableRow } from './table-row';

export interface TableData {
  columns: TableColumn[];
  columnTranslations?: Record<string, string>;
  rows: TableRow[];
}
