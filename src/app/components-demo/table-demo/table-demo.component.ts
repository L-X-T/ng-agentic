import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  ActionHierarchy,
  ActionType,
  FilterOperator,
  TableColumnTranslations,
  TableComponent,
  TableData,
  Toolbar,
} from '@components/table';
import { ButtonComponent } from '@components/button';

import { USER_COLUMN_TRANSLATIONS_DE, USER_COLUMN_TRANSLATIONS_EN, USERS } from './data';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';

import { AGGREGATIONS_DATA } from './aggregation-data';
import { CELLTYPES_DATA } from './cellTypes-data';

export enum ScreenComponentType {
  Container = 'container',
  Form = 'form',
  SingleValue = 'single-value',
  SingleRecord = 'single-record',
  Tab = 'tab',
  Table = 'table',
}

export enum FieldType {
  ButtonCancel = 'button-cancel',
  ButtonSubmit = 'button-submit',
  Hidden = 'hidden',
  Input = 'input',
  Password = 'password',
}

export type Strategy =
  | SizeColumnsToFitGridStrategy
  | SizeColumnsToFitProvidedWidthStrategy
  | SizeColumnsToContentStrategy;

@Component({
  selector: 'lxt-tab-demo',
  imports: [TableComponent, FormsModule, ReactiveFormsModule, NgSelectComponent, ButtonComponent],
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableDemoComponent {
  users: TableData = USERS;
  aggregationUsers: TableData = AGGREGATIONS_DATA;
  cellDataTypes: TableData = CELLTYPES_DATA;
  isSelectionEnabled = false;
  isStrategyReady = true;
  allowMultiSelection = false;
  allowRowGrouping = true;

  columnTranslations: TableColumnTranslations = USER_COLUMN_TRANSLATIONS_EN;

  private fb = inject(NonNullableFormBuilder);

  renderersForm = this.fb.group({
    formatDate: ['yyyy-MM-dd'],
  });

  protected testForm: FormGroup = this.fb.group({
    columsWidth: ['fitGridWidth'],
    rowGrouping: ['always'],
  });

  protected strategies: Strategy[] = [
    {
      type: 'fitGridWidth',
    },
    {
      type: 'fitProvidedWidth',
      width: 1000,
    },
    {
      type: 'fitCellContents',
    },
  ];

  protected rowGrouping = [
    {
      type: 'always',
    },
    {
      type: 'onlyWhenGrouping',
    },
    {
      type: 'never',
    },
  ];

  onStrategyChanged(): void {
    // We must do it this way, so the grid rerenders
    // Aparently used strategy cannot be changed dynamically
    this.isStrategyReady = false;
    setTimeout(() => {
      this.isStrategyReady = true;
    }, 0);
  }

  onChangeLanguage(language: string): void {
    if (language === 'de') {
      this.columnTranslations = USER_COLUMN_TRANSLATIONS_DE;
    } else {
      this.columnTranslations = USER_COLUMN_TRANSLATIONS_EN;
    }
  }

  toolbar: Toolbar = {
    title: 'Table',
    actions: [
      {
        key: 'delete',
        title: 'DELETE',
        icon: 'delete',
        keyBinding: 'ctrl +',
        type: ActionType.Delete,
        destructive: true,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: 'create-system',
        executionConditions: [],
      },
      {
        key: 'add',
        title: 'Add',
        hierarchy: ActionHierarchy.Primary,
        destructive: false,
        icon: 'add',
        keyBinding: 'ctrl+a',
        type: ActionType.Submit,
        methodKey: 'add',
        dataKey: 'add',
        targetScreenRoutingCommands: ['add'],
        targetDialog: {
          key: 'add',
          title: 'Add',
          component: null, // [TODO] Has to be a ScreenComponent, which currently only exists in the other repo.
        },
        minRecords: 0,
        maxRecords: 0,
        executionConditions: [
          {
            referenceColumn: 'id',
            operator: 'eq' as FilterOperator,
            value: 'number',
          },
        ],
      },
    ],
  };

  realToolbar: Toolbar = {
    title: 'TOOLBAR',
    actions: [
      {
        key: 'filter',
        title: 'FILTER',
        icon: 'filter',
        type: ActionType.Filter,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
      },
      {
        key: 'delete',
        title: 'DELETE',
        icon: 'delete',
        keyBinding: 'ctrl +',
        type: ActionType.Delete,
        destructive: true,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: 'create-system',
        executionConditions: [],
        disabled: true,
      },
      {
        key: 'edit',
        title: 'EDIT',
        icon: 'edit',
        type: ActionType.Edit,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
      },
      {
        key: 'add',
        title: 'ADD',
        icon: 'add',
        type: ActionType.Edit,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
      },
      {
        key: 'edit',
        title: 'EDIT',
        icon: 'edit',
        type: ActionType.Edit,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
        disabled: true,
      },
      {
        key: 'copy',
        title: 'Copy',
        icon: 'copy',
        type: ActionType.Edit,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
      },
      {
        key: 'export',
        title: 'EXPORT',
        icon: 'export',
        type: ActionType.Submit,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
      },
      {
        key: 'import',
        title: 'IMPORT',
        icon: 'import',
        type: ActionType.Submit,
        hierarchy: ActionHierarchy.Secondary,
        methodKey: '',
        executionConditions: [],
      },
    ],
  };
}
