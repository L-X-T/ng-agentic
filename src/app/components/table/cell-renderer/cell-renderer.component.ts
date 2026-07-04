import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CellData } from '../entities/cell-data-type';
import { TableColumn } from '../entities/table-column';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  templateUrl: './cell-renderer.component.html',
  styleUrl: './cell-renderer.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellRendererComponent implements ICellRendererAngularComp {
  value = '';
  columnName = '';
  columnType = CellData.TEXT;
  dateFormat = '';
  group = false;
  aggFunc: string | undefined = undefined;

  agInit(params: ICellRendererParams & TableColumn): void {
    this.value = '';
    this.aggFunc = undefined;
    this.value = params?.value ?? '';
    this.group = params.node.group ?? false;
    if (this.group) {
      this.aggFunc = params.column?.getAggFunc() as string;
    }
    this.dateFormat = params['dateFormat'];
    this.columnType =
      params['columns'].find((column: TableColumn) => column.field === params.column?.getColId())?.cellDataType ??
      CellData.TEXT;
  }

  refresh(params: ICellRendererParams & TableColumn): boolean {
    this.value = '';
    this.aggFunc = undefined;
    this.value = params.value.result;
    this.group = params.node.group ?? false;
    if (this.group) {
      this.aggFunc = params.column?.getAggFunc() as string;
    }
    this.dateFormat = params['dateFormat'];
    this.columnType =
      params['columns'].find((column: TableColumn) => column.field === params.column?.getColId())?.cellDataType ??
      CellData.TEXT;
    return true;
  }
}
