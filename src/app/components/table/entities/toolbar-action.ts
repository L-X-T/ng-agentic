import { Dialog } from './dialog';
import { ActionType } from './action-type';
import { ActionExecutionCondition } from './action-execution-condition';
import { ActionHierarchy } from './action-hierarchy';

export interface ToolbarAction {
  key: string;
  title: string;
  hierarchy: ActionHierarchy;
  destructive?: boolean;
  icon?: string;
  keyBinding?: string;
  // TODO REMOVE NOT NEEDED
  type: ActionType;
  methodKey: string;
  dataKey?: string;
  // TODO should maybe configured as targetScreenKey in description language
  targetScreenRoutingCommands?: string[];
  targetDialog?: Dialog;
  minRecords?: number | undefined;
  maxRecords?: number | undefined;
  executionConditions: ActionExecutionCondition[];
  disabled?: boolean; // temporary solution
}
