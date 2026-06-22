import 'ag-grid-enterprise';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GridOptions,
  ICellRendererParams,
  MenuItemDef,
  PaginationNumberFormatterParams,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import { SideBarDef } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

import { TableColumn } from './entities/table-column';
import { TableColumnTranslations } from './entities/table-column-translations';
import { TableData } from './entities/table-data';
import { TableRow } from './entities/table-row';
import { Toolbar } from './entities/toolbar';
import { ToolbarAction } from './entities/toolbar-action';
import { Aggregation } from './entities/aggregations';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { PageSelectorComponent } from './page-selector/page-selector.component';
import { AggregationRowComponent } from './aggregation-row/aggregation-row.component';
import { CellData } from './entities/cell-data-type';
import {
  renderBooleanTemplate,
  renderCheckboxTemplate,
  renderDateTemplate,
  renderDefaultTemplate,
  renderOrdinalNumberTemplate,
  renderProgressTemplate,
  renderStatusTemplate,
} from './cell-renderer/renderer-templates';
import { BitMask, customCellRendererMask, numbersOnlyMask, Types } from './entities/types-bitmask';
import { left } from '@popperjs/core';

@Component({
  selector: 'lxt-table',
  imports: [AgGridAngular, FormsModule, ReactiveFormsModule, ToolbarComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TableComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() tableData!: TableData;
  @Input() toolbar!: Toolbar;
  @Input() editRoute = '';
  @Input() rowId = 'id';
  @Input() rowHeight = 0;
  @Input() allowMultiSelection!: boolean | undefined;
  @Input() isLoading = false;
  @Input() componentDefaultColumns!: TableColumn[];
  @Input() columnTranslations!: TableColumnTranslations;
  @Input() paginationPageSize: number | undefined = 20;
  @Input() isSelectionEnabled = true;
  @Input() columnsSizeStrategy: 'fitGridWidth' | 'fitCellContents' | 'fitProvidedWidth' = 'fitProvidedWidth';
  @Input() rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' | undefined = 'onlyWhenGrouping';
  @Input() showAggRow = false;
  @Input() dateFormat = 'yyyy-MM-dd';
  @Input() allowRowGrouping = true;
  @Input() pagination = true;
  @Input() primaryKeyColumns: string[] = [];

  @Output() actionExecuted = new EventEmitter<ToolbarAction>();
  @Output() rowSelected = new EventEmitter<TableRow[]>();

  @ViewChild('myGrid') grid!: AgGridAngular;
  @ViewChild('myGrid', { read: ElementRef }) gridRef!: ElementRef;

  bottomRowData: any[] = [{}];
  appliedAggFuncs: { [key in Aggregation]?: boolean } = {};
  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  columnTypes!: { [key: string]: ColDef };
  defaultColDef!: ColDef;
  paginationAutoPageSize = false; // [TODO] set true for mobile
  paginationNumberFormatter!: (params: PaginationNumberFormatterParams<any, any>) => string;
  selectedRows: TableRow[] = [];
  selectedRowCount = 0;
  selectionMessage = '';
  sideBar!: SideBarDef | string | string[] | boolean | null;
  gridOptions!: GridOptions;
  autoSizeStrategy!:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy;

  overlayLoadingTemplate =
    '<object style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%) scale(2)" type="image/svg+xml" data="https://ag-grid.com/images/ag-grid-loading-spinner.svg" aria-label="loading"></object>';
  overlayNoRowsTemplate = '<span>No rows to show</span>';

  getRowId: GetRowIdFunc<any> = (params) => {
    let rowId = '';
    this.primaryKeyColumns.forEach((column) => {
      if (rowId !== '') {
        rowId += '-';
      }
      rowId += params.data[column];
    });
    return rowId;
  };

  private isAutoSized = false;

  ngOnInit(): void {
    this.setUpGridOptions();
    this.setUpColumnTypes();
    this.setUpPagination();
    this.setUpRowHeight();
    this.setUpSideBar();
    this.setUpAutoSizing();
    this.setUpAggRow();
  }

  ngAfterViewInit(): void {
    this.setUpOnIntersection();
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    const activeElement = (<any>event).explicitOriginalTarget;
    if (activeElement?.tagName === 'INPUT' || !event.shiftKey) {
      return;
    }

    switch (event.key) {
      case 'Home':
        this.grid.api.paginationGoToFirstPage();
        break;
      case 'End':
        this.grid.api.paginationGoToLastPage();
        break;
      case 'ArrowLeft':
        this.grid.api.paginationGoToPreviousPage();
        break;
      case 'ArrowRight':
        this.grid.api.paginationGoToNextPage();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const tableData: TableData = changes['tableData']?.currentValue;
      if (tableData) {
        if (tableData.columns?.length) {
          this.setUpColumns(tableData);
        }

        // WARNING we need to update the rows via the grid API because only then the event
        // onRowDataUpdated is emitted, which we need to propagate the current selection
        // after a data reload
        if (changes['tableData'].previousValue) {
          this.grid.api.setGridOption('rowData', tableData.rows.length ? tableData.rows : []);
        } else {
          this.rows = tableData.rows?.length ? [...tableData.rows] : [];
        }
      }
      const dateFormat = changes['dateFormat'];
      if (dateFormat) {
        this.refreshGrid();
      }
      const selection = changes['isSelectionEnabled'];
      if (selection) {
        this.setSelection(selection.currentValue);
      }
      if (this.grid?.api) {
        if (changes['isLoading']?.currentValue === true) {
          this.grid.api.showLoadingOverlay();
        } else {
          this.grid.api.hideOverlay();
        }
      }
    }

    // If data has no rows currently no columns are returned, so we use the query params from the screen definition
    if (!this.columns || this.columns?.length < 1) {
      this.columns = this.componentDefaultColumns;
    }

    if (changes['columnTranslations'] && !changes['columnTranslations'].firstChange) {
      this.updateColumnTranslations(changes['columnTranslations'].currentValue);
    }

    this.prepareSelectionMessage();
  }

  private setUpOnIntersection() {
    const options: IntersectionObserverInit = {
      root: document.documentElement,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!this.isAutoSized && entry.intersectionRatio > 0) {
          this.grid.api.autoSizeAllColumns();
          this.isAutoSized = true;
          observer.disconnect();
          return;
        }
      });
    }, options);

    observer.observe(this.gridRef.nativeElement);
  }

  private setUpColumns(tableData: TableData) {
    this.columns = [
      ...tableData.columns
        .filter((col) => col.isVisible)
        .map((col) => ({
          ...col,
          headerName: this.columnTranslations?.[col.localizerKey ?? ''] ?? col.field,
          cellStyle: col.cellDataType === 'number' ? { textAlign: 'right' } : {},
        })),
    ];
  }

  private updateColumnTranslations(translations: TableColumnTranslations) {
    this.columns = [
      ...this.columns.map((col) => ({ ...col, headerName: translations[col.localizerKey ?? ''] ?? col.field })),
    ];
  }

  private showIcon = (aggFunc: Aggregation) => {
    if (this.appliedAggFuncs[aggFunc]) {
      return '<i class="icon i-lxt-check"></i>';
    }
    return '';
  };

  private getMainMenuItems = (params: any) => {
    let items = params.defaultItems;
    if (!this.allowRowGrouping) {
      items = items.filter((item: any) => item !== 'rowGroup');
    }
    items.push({
      name: 'Aggregation func.',
      subMenu: this.getAggregationContextMenu(params),
      icon: '<i class="fa fa-star"></i>',
      disabled: false,
    });
    return items;
  };

  private getContextMenuItems = (params: any) => {
    // Context menu for aggregation row
    if (params.node.id.match(/b-[0-9]{1,2}/g)) {
      return [];
    }

    return this.getRowContextMenu();
  };

  private getAggregationContextMenu(params: any) {
    if (!this.grid.columnDefs) {
      return [];
    }
    const types = new BitMask();
    for (const columnDef of this.grid.columnDefs) {
      const column = (<ColDef>columnDef).field;
      if (!column) {
        continue;
      }

      const type = this.grid.api.getColumn(column)?.getUserProvidedColDef()?.cellDataType ?? 'text';
      switch (type) {
        case 'text':
        case 'boolean':
        case 'checkbox':
        case 'ordinalNumber':
          types.setFlag(Types.text);
          break;
        case 'number':
        case 'status':
        case 'progress':
          types.setFlag(Types.number);
          break;
        case 'date':
          types.setFlag(Types.date);
          break;
      }
    }
    const defalutActions = [
      {
        name: 'count',
        icon: this.showIcon(Aggregation.COUNT),
        action: () => {
          this.addAggregation(Aggregation.COUNT);
        },
      },
      {
        name: 'count_d',
        icon: this.showIcon(Aggregation.COUNT_DISTINCT),
        action: () => {
          this.addAggregation(Aggregation.COUNT_DISTINCT);
        },
      },
      {
        name: 'first',
        icon: this.showIcon(Aggregation.FIRST),
        action: () => {
          this.addAggregation(Aggregation.FIRST);
        },
      },
      {
        name: 'last',
        icon: this.showIcon(Aggregation.LAST),
        action: () => {
          this.addAggregation(Aggregation.LAST);
        },
      },
      {
        name: 'avg',
        icon: this.showIcon(Aggregation.AVERAGE),
        action: () => {
          this.addAggregation(Aggregation.AVERAGE);
        },
        disabled: !types.checkFlag(Types.number),
      },
      {
        name: 'median',
        icon: this.showIcon(Aggregation.MEDIAN),
        action: () => {
          this.addAggregation(Aggregation.MEDIAN);
        },
        disabled: !types.checkFlag(Types.number),
      },
      {
        name: 'sum',
        icon: this.showIcon(Aggregation.SUM),
        action: () => {
          this.addAggregation(Aggregation.SUM);
        },
        disabled: !types.checkFlag(Types.number),
      },
      {
        name: 'max',
        icon: this.showIcon(Aggregation.MAX),
        action: () => {
          this.addAggregation(Aggregation.MAX);
        },
        disabled: !types.checkFlag(Types.number | Types.date),
      },
      {
        name: 'min',
        icon: this.showIcon(Aggregation.MIN),
        action: () => {
          this.addAggregation(Aggregation.MIN);
        },
        disabled: !types.checkFlag(Types.number | Types.date),
      },
    ];
    return defalutActions;
  }

  private getRowContextMenu(): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = [];
    if (this.toolbar?.actions) {
      for (const action of this.toolbar.actions) {
        result.push({
          icon: `<span class="icon i-lxt-${action.icon}"></span>`,
          name: action.key,
          shortcut: action.keyBinding,
          cssClasses: action.destructive ? ['context-menu-item--destructive'] : [],
          disabled: action.disabled,
        });
      }
      result.push('separator');
    }
    result.push({
      name: 'Clear all settings',
      action: () => {},
    });
    result.push({
      name: 'Send message',
      action: () => {},
    });
    result.push('separator');
    result.push({
      name: 'Reload',
      action: () => {},
    });
    return result;
  }

  private setUpGridOptions(): void {
    this.gridOptions = {
      autoGroupColumnDef: {
        headerCheckboxSelection: true,
        cellRendererParams: {
          checkbox: true,
          checkboxPosition: 'before',
        },
        suppressMovable: true,
        lockPosition: left,
      },
      suppressCopyRowsToClipboard: true,
      cellFlashDuration: 0,
      cellFadeDuration: 0,
      localeText: {
        values: 'Row groups values',
      },
      aggFuncs: {
        min: this.minAggregation.bind(this),
        max: this.maxAggregation.bind(this),
        sum: this.sumAggregation.bind(this),
        avg: this.averageAggregation.bind(this),
        first: this.firstAggregation.bind(this),
        last: this.lastAggregation.bind(this),
        count: this.countAggregation.bind(this),
        count_d: this.countDistinctAggregation.bind(this),
        median: this.medianAggregation.bind(this),
      },
      suppressRowClickSelection: !this.isSelectionEnabled,
      statusBar: this.pagination
        ? {
            statusPanels: [
              { statusPanel: PageSelectorComponent, align: 'left' },
              { statusPanel: PaginatorComponent, align: 'right' },
            ],
          }
        : undefined,
      getContextMenuItems: this.getContextMenuItems,
      getMainMenuItems: this.getMainMenuItems,
      onCellContextMenu: this.onCellContextMenu,
    };
  }

  onCellContextMenu = () => {
    setTimeout(() => {
      const menu = this.gridRef.nativeElement.querySelector('.ag-menu') as HTMLElement;
      if (!menu) {
        return;
      }
      const menuRect = menu.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (menuRect.bottom > viewportHeight) {
        const gridElement = this.gridRef.nativeElement;
        const gridHeight = gridElement.offsetHeight - (gridElement.getBoundingClientRect().bottom - viewportHeight);
        const top = Math.floor(Math.max(0, gridHeight - (menuRect.height + 16)));
        menu.style.top = `${top}px`;
      }
    }, 0);
  };

  private setSelection(selection: boolean): void {
    this.isSelectionEnabled = selection;
    if (this.grid) {
      this.grid.api.updateGridOptions({
        suppressRowClickSelection: !this.isSelectionEnabled,
      });
      this.refreshGrid();
    }
  }

  protected reload(): void {
    const aggFuncs = this.bottomRowData.map((aggFunc) =>
      Object.keys(aggFunc).map((key) => ({ col: key, aggType: aggFunc[key].aggFunction })),
    );
    this.bottomRowData = [{}];
    for (const aggRow of aggFuncs) {
      for (const foo of aggRow) {
        this.addAggregation(foo.aggType);
      }
    }
    if (this.grid.api.getDisplayedRowCount() === 0) {
      this.grid.api.showNoRowsOverlay();
    } else {
      this.grid.api.hideOverlay();
    }
  }

  private setUpAggRow(): void {
    if (!this.showAggRow) {
      return;
    }
    this.bottomRowData = [{}];
  }

  private addAggregation(aggType: Aggregation): void {
    this.appliedAggFuncs[aggType] = !this.appliedAggFuncs[aggType];
    if (!this.grid.columnDefs) {
      return;
    }
    for (const columnDef of this.grid.columnDefs) {
      const allRows: { colDefs: ColDef; values: any[] } = { colDefs: {}, values: [] };
      const column = (<ColDef>columnDef).field;
      const type = (<ColDef>columnDef).type as keyof typeof Types;

      if (!column) {
        continue;
      }
      allRows.colDefs = columnDef;
      let index = this.bottomRowData.findIndex((row) => row[column]?.aggFunction === aggType);
      if (index >= 0) {
        delete this.bottomRowData[index][column];
        for (let i = index + 1; i < this.bottomRowData.length; i++) {
          if (this.bottomRowData[i][column]) {
            this.bottomRowData[index++][column] = this.bottomRowData[i][column];
          }
          delete this.bottomRowData[i][column];
        }
        this.bottomRowData = this.bottomRowData.filter((row) => Object.keys(row).length > 0);
        if (this.bottomRowData.length === 0) {
          this.bottomRowData = [{}];
        }
        this.bottomRowData = [...this.bottomRowData];
        continue;
      }

      this.grid.api.forEachNodeAfterFilterAndSort((node) => {
        if (!node.group) {
          allRows.values.push(node.data[column]);
        }
      });
      let value: number | string = 0;
      switch (aggType) {
        case Aggregation.SUM:
          if (numbersOnlyMask.checkFlag(Types[type])) {
            value = this.sumAggregation(allRows);
          }
          break;
        case Aggregation.COUNT:
          value = this.countAggregation(allRows);
          break;
        case Aggregation.COUNT_DISTINCT:
          value = this.countDistinctAggregation(allRows);
          break;
        case Aggregation.AVERAGE:
          value = this.averageAggregation(allRows);
          break;
        case Aggregation.FIRST:
          value = this.firstAggregation(allRows);
          break;
        case Aggregation.LAST:
          value = this.lastAggregation(allRows);
          break;
        case Aggregation.MAX:
          value = this.maxAggregation(allRows);
          break;
        case Aggregation.MIN:
          value = this.minAggregation(allRows);
          break;
        case Aggregation.MEDIAN:
          value = this.medianAggregation(allRows);
          break;
        default:
          break;
      }
      const object = { aggFunction: aggType, value: value };
      //const emptyIndex = this.bottomRowData.findIndex(
      //  (row) =>
      //    !row[column] && (Object.entries(row)?.findIndex((entry: any) => entry['aggFunction'] !== aggType) ?? -1) >= 0,
      //);
      //console.log(emptyIndex);
      const lastIndex = this.bottomRowData.length - 1;
      const entries = Object.entries(this.bottomRowData[lastIndex]);

      if (value === '') {
        continue;
      }
      if (entries.length === 0 || entries.find((entry: any) => entry[1]?.aggFunction === aggType)) {
        this.bottomRowData[lastIndex][column] = object;
      } else {
        this.bottomRowData.push({ [column]: object });
      }
      this.bottomRowData = [...this.bottomRowData];
    }
    if (Object.keys(this.bottomRowData[0]).length === 0) {
      this.showAggRow = false;
    } else {
      this.showAggRow = true;
    }
  }

  firstAggregation(rows: any): string {
    rows = rows.values;
    return rows[0] ?? '';
  }

  lastAggregation(rows: any) {
    rows = rows.values;
    return rows.at(-1) ?? '';
  }

  countAggregation(rows: any) {
    rows = rows.values;
    return rows.length;
  }

  countDistinctAggregation(rows: any) {
    rows = rows.values;
    return new Set(rows).size;
  }

  medianAggregation(rows: any) {
    if (!this.isColTypeNumber(rows.colDef)) {
      return '';
    }
    rows = rows.values;
    if (!rows || !rows.every) {
      return '';
    }
    if (!rows.every((item: any) => typeof item === 'number' && !isNaN(item))) {
      return '';
    }
    const sortedRows = rows.sort((a: any, b: any) => a - b);
    const condition = !!(rows.length % 2) || isNaN(rows[0]);
    const index = Math.floor(rows.length / 2);
    const value = condition ? sortedRows[index] : (sortedRows[index] + sortedRows[index + 1]) / 2;
    return value;
  }

  minAggregation(rows: any) {
    rows = rows.values;
    if (!rows.every || !rows.every((item: any) => (typeof item === 'number' && !isNaN(item)) || item.getTime)) {
      return '';
    }
    return rows.sort((a: any, b: any) => a - b)[0] ?? '';
  }

  maxAggregation(rows: any) {
    rows = rows.values;
    if (!rows.every || !rows.every((item: any) => (typeof item === 'number' && !isNaN(item)) || item.getTime)) {
      return '';
    }
    return rows.sort((a: any, b: any) => b - a)[0] ?? '';
  }

  sumAggregation(rows: any) {
    if (!this.isColTypeNumber(rows.colDef)) {
      return '';
    }
    rows = rows.values;
    if (!rows) {
      return '';
    }
    let sum = 0;
    for (const row of rows) {
      if (isNaN(row) || row?.getTime) {
        return '';
      }
      sum += row;
    }
    return sum;
  }

  averageAggregation(rows: any) {
    if (!this.isColTypeNumber(rows.colDef)) {
      return '';
    }
    rows = rows.values;
    if (!rows) {
      return '';
    }
    const sum = this.sumAggregation(rows);
    if (isNaN(<number>sum)) {
      return '';
    }
    return <number>sum / rows.length;
  }

  isColTypeNumber(colDef: ColDef) {
    const type = colDef.cellDataType as keyof typeof Types;
    return numbersOnlyMask.checkFlag(Types[type]);
  }

  private setUpColumnTypes(): void {
    // Setting properties across ALL Columns
    this.defaultColDef = {
      checkboxSelection: (params) => {
        // If the row selection is disabled we do not want to show the redudant checkboxes
        if (!this.isSelectionEnabled) {
          return false;
        }
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        const condition = params.node.group || params.colDef?.colId === 'ag-Grid-AutoColumn';
        return displayedColumns[0] === params.column && !condition;
      },
      editable: false,
      //flex: 1, // [TODO] Stretch columns to fill the grid
      headerCheckboxSelection: (params) => {
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        const condition = displayedColumns[0].getColDef().colId === 'ag-Grid-AutoColumn';
        return displayedColumns[0] === params.column && !condition;
      },
      resizable: true,
      sortable: true,
      unSortIcon: true,
      enableRowGroup: true,
      enableValue: true,
      filter: true,
      cellRendererSelector: (params) => {
        if (params.colDef?.colId === 'ag-Grid-AutoColumn' && !params.value) {
          return {
            component: 'agGroupCellRenderer',
          };
        }
        if (params.node.group && params.colDef?.colId === 'ag-Grid-AutoColumn') {
          return {
            component: 'agGroupCellRenderer',
          };
        }
        if (params.node.rowPinned) {
          return {
            component: AggregationRowComponent,
            params: {
              ...params,
              autoHeight: true,
              columns: this.tableData.columns,
              bottomRowData: this.bottomRowData,
              dateFormat: this.dateFormat,
            },
          };
        } else {
          const type = params.colDef?.cellDataType as keyof typeof Types;
          if (!customCellRendererMask.checkFlag(Types[type])) {
            return {
              component: undefined,
            };
          }
          return {
            component: (params: ICellRendererParams & TableColumn) => {
              let value = '';
              let aggFunc;
              const group = params.node.group ?? false;
              value = params?.value ?? '';
              if (group) {
                aggFunc = params.column?.getAggFunc() as string;
              }
              const dateFormat = params['dateFormat'];
              const columnType =
                params['columns'].find((column: TableColumn) => column.field === params.column?.getColId())
                  ?.cellDataType ?? CellData.TEXT;

              if (value || !group) {
                switch (columnType) {
                  case 'boolean':
                    return renderBooleanTemplate(value, aggFunc ?? '');
                  case 'checkbox':
                    return renderCheckboxTemplate(value, aggFunc ?? '');
                  case 'date':
                    return renderDateTemplate(value, aggFunc ?? '', dateFormat);
                  case 'ordinalNumber':
                    return renderOrdinalNumberTemplate(value, aggFunc ?? '');
                  case 'status':
                    return renderStatusTemplate(value, aggFunc ?? '');
                  case 'progress':
                    return renderProgressTemplate(value, aggFunc ?? '');
                  default:
                    return renderDefaultTemplate(value);
                }
              } else {
                return '';
              }
            },
            params: {
              ...params,
              columns: this.tableData.columns,
              dateFormat: this.dateFormat,
            },
          };
        }
      },
    };

    // Setting a set of column properties for a group types
    this.columnTypes = {
      integer: {
        headerClass: 'ag-right-aligned-header',
        cellClass: 'ag-right-aligned-cell',
      },
      number: {
        headerClass: 'ag-right-aligned-header',
        cellClass: 'ag-right-aligned-cell',
      },
      decimal: {
        headerClass: 'ag-right-aligned-header',
        cellClass: 'ag-right-aligned-cell',
      },
      string: {},
      boolean: {},
      date: {},
    };
  }

  private setUpPagination(): void {
    if (this.paginationPageSize && this.rows?.length > this.paginationPageSize) {
      this.paginationNumberFormatter = (params: any) => params.value.toString();
    }
  }

  private setUpRowHeight(): void {
    this.rowHeight = 30; // [TODO]
  }

  private setUpSideBar(): void {
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressPivotMode: true,
            suppressValues: true,
          },
        },
      ],
    };
  }

  private setUpAutoSizing(): void {
    switch (this.columnsSizeStrategy) {
      case 'fitCellContents':
        this.autoSizeStrategy = {
          type: 'fitCellContents',
        };
        break;
      case 'fitProvidedWidth':
        this.autoSizeStrategy = {
          type: 'fitProvidedWidth',
          width: 1000,
        };
        break;
      default:
        this.autoSizeStrategy = {
          type: 'fitGridWidth',
        };
    }
  }

  onSelectionChanged(): void {
    this.readSelectedRowsAndEmitThem();
  }

  private readSelectedRowsAndEmitThem(): void {
    this.selectedRows = this.grid.api.getSelectedRows();
    this.selectedRowCount = this.selectedRows ? this.selectedRows.length : 0;
    this.prepareSelectionMessage();
    this.rowSelected.emit(this.selectedRows?.length ? this.selectedRows : []);
  }

  private prepareSelectionMessage(): void {
    const totalRowCount = this.rows?.length ?? 0;
    let rowCount = 0;
    if (this.grid) {
      rowCount = this.grid.api.getDisplayedRowCount();
      if (rowCount > totalRowCount) {
        rowCount = totalRowCount;
      }
    } else {
      rowCount = totalRowCount;
    }
    this.selectionMessage = `${rowCount} rows`;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    this.selectFirstRow();
  }

  private selectFirstRow(): void {
    if (this.grid) {
      const rowModel = this.grid.api.getModel();
      const firstRowNode = rowModel.getRow(0);
      if (firstRowNode && this.isSelectionEnabled) {
        firstRowNode.setSelected(true);
      }
    }
  }

  onSearch(searchTerm: string): void {
    this.grid.api.setQuickFilter(searchTerm);
    this.prepareSelectionMessage();
  }

  onColumnChanged() {
    this.reload();
  }

  onColumnGroupChanged(): void {
    const columns = this.grid.api.getColumns();
    const isColumnGrouped = columns?.some((column) => column['rowGroupActive']) ?? false;
    this.setVisibilityValuesSection(isColumnGrouped);
  }

  refreshGrid() {
    if (!this.grid) {
      return;
    }
    this.grid?.api.redrawRows();
    this.reload();
  }

  private setVisibilityValuesSection(visible: boolean): void {
    const columnToolPanel = this.grid.api.getToolPanelInstance('columns');
    if (columnToolPanel) {
      columnToolPanel.setValuesSectionVisible(visible);
    }
  }

  onRowDataUpdated(): void {
    this.readSelectedRowsAndEmitThem();
  }
}
