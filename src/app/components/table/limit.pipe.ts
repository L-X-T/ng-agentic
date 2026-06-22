import { Pipe, PipeTransform } from '@angular/core';
import { ToolbarAction } from './entities/toolbar-action';

@Pipe({
  name: 'limit',
})
export class LimitPipe implements PipeTransform {
  transform(value: ToolbarAction[], limit: number): ToolbarAction[] {
    if (limit) {
      return value.slice(0, limit);
    }
    return value;
  }
}
