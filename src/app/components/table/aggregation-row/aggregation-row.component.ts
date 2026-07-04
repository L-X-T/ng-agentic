import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { TableColumn } from '../entities/table-column';
import { CellData } from '../entities/cell-data-type';

@Component({
  template: `
    @if (function) {
      <span>{{ function.aggFunction + ' = ' }}</span>
      <span>
        @if (columnType === 'date' || columnType === 'dateString') {
          @if (function.aggFunction === 'count' || function.aggFunction === 'count_d') {
            <b>{{ function.value }}</b>
          } @else {
            <b>{{ function.value | date: dateFormat }}</b>
          }
        } @else {
          <b>{{ function.value }}</b>
        }
      </span>
    }
  `,
  imports: [DatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregationRowComponent implements ICellRendererAngularComp {
  function?: { aggFunction: string; value: string | number };
  columnName = '';
  aggFunctionSelected = '';
  dateFormat = '';
  columnType = CellData.TEXT;

  constructor(private elref: ElementRef) {}

  agInit(params: ICellRendererParams & TableColumn): void {
    this.function = params?.value;
    this.dateFormat = params['dateFormat'];
    this.columnType =
      params['columns'].find((column: TableColumn) => column.field === params.column?.getColId())?.cellDataType ??
      CellData.TEXT;
  }

  refresh(params: ICellRendererParams & TableColumn): boolean {
    this.function = params?.value;
    this.dateFormat = params['dateFormat'];
    this.columnType =
      params['columns'].find((column: TableColumn) => column.field === params.column?.getColId())?.cellDataType ??
      CellData.TEXT;
    return true;
  }
}
