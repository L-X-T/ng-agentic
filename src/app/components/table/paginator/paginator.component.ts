import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';

import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';

import { ButtonComponent } from '@components/button';

import { TableService } from '../table.service';

@Component({
  selector: 'lxt-paginator',
  imports: [ButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements IStatusPanelAngularComp, OnDestroy {
  params!: IStatusPanelParams;
  currentPage = 0;
  totalPages = 0;
  rangeStart = 0;
  rangeEnd = 0;
  private _currentPageString = '0';
  set currentPageString(value: string) {
    this._currentPageString = value;
    this.setToPage();
  }

  get currentPageString(): string {
    return this._currentPageString;
  }

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
      this.currentPage = this.params.api.paginationGetCurrentPage() + 1;
      this.totalPages = this.params.api.paginationGetTotalPages();
      this.currentPageString = this.currentPage.toString();
    }
    this.cdr.detectChanges();
  };

  setToPage(): void {
    const value = parseInt(this.currentPageString, 10) - 1;
    if (isNaN(value)) {
      return;
    }
    const gotoPage = Math.max(Math.min(value, this.params.api.paginationGetTotalPages()), 0);
    if (this.params.api) {
      this.params.api.paginationGoToPage(gotoPage);
    }
    this.cdr.detectChanges();
  }

  goToPage(page: 'next' | 'prev' | 'first' | 'last') {
    switch (page) {
      case 'next':
        this.params.api.paginationGoToNextPage();
        break;
      case 'prev':
        this.params.api.paginationGoToPreviousPage();
        break;
      case 'first':
        this.params.api.paginationGoToFirstPage();
        break;
      case 'last':
        this.params.api.paginationGoToLastPage();
    }
  }

  onActionsMenuClick() {
    this.tableService.isMoreButtonClicked.set(true);
  }
}
