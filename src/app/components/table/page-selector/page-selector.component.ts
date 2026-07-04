import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectComponent } from '@ng-select/ng-select';
import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';

import { ButtonComponent } from '@components/button';

import { TableService } from '../table.service';

@Component({
  selector: 'lxt-page-selector',
  imports: [CommonModule, NgSelectComponent, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './page-selector.component.html',
  styleUrl: './page-selector.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSelectorComponent implements IStatusPanelAngularComp, OnDestroy {
  params!: IStatusPanelParams;
  rangeStart = 0;
  rangeEnd = 0;
  totalRows = 0;
  pageSizeSelected = 20;
  pageSizeOptions: { value: number; label: string }[] = [];

  tableService = inject(TableService);
  private cdr = inject(ChangeDetectorRef);

  ngOnDestroy() {
    this.params.api.removeEventListener('paginationChanged', this.updatePagination);
    this.params.api.removeEventListener('gridReady', this.updatePagination);
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    params.api.addEventListener('paginationChanged', this.updatePagination);
    params.api.addEventListener('gridReady', this.updatePagination);
  }

  updatePagination = (): void => {
    if (this.params.api) {
      this.rangeStart = this.params.api.getFirstDisplayedRowIndex() + 1;
      this.rangeEnd = this.params.api.getLastDisplayedRowIndex() + 1;
      this.totalRows = this.params.api.paginationGetRowCount();
      this.pageSizeOptions = (<number[]>this.params.api.getGridOption('paginationPageSizeSelector')).map((option) => ({
        value: option,
        label: option.toString(),
      }));
      this.pageSizeSelected = this.params.api.paginationGetPageSize();
    }
    this.cdr.detectChanges();
  };

  onSizeChange() {
    this.params.api.paginationSetPageSize(this.pageSizeSelected);
  }

  onCancelClicked() {
    this.tableService.isMoreButtonClicked.set(false);
  }
}
