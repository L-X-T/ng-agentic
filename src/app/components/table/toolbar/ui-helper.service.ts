import { Injectable } from '@angular/core';

import { DataValue, FilterOperator } from '../index';

@Injectable({ providedIn: 'root' })
export class UiHelperService {
  compareValues(value1: DataValue, operator: FilterOperator, value2: DataValue) {
    switch (operator) {
      case 'eq':
        return value1 === value2;
      case 'ne':
        return value1 !== value2;
      default:
        throw new Error(`Comparison operator <${operator}> is not supported`);
    }
  }
}
