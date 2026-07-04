import { DataValue } from './data-value';
import { FilterOperator } from './filter-operator';

export interface ActionExecutionCondition {
  referenceColumn: string;
  operator: FilterOperator;
  value: DataValue;
}
