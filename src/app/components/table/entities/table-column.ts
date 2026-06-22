import { CellData } from './cell-data-type';
import { TableColumnGroup } from './table-column-group';
import { TableRow } from './table-row';

export type TableColumn = {
  field: string;
  headerName?: string;
  isVisible?: boolean; // TODO remove optional after removal of mock data service
  localizerKey?: string;
  cellDataType?: CellData;
  children?: TableColumn[];
  group?: TableColumnGroup;
  isPrimaryKey?: boolean;
} & TableRow;
