import { Directive } from '@angular/core';
import { hlm } from './hlm.util';

const LABEL_CLASS = hlm(
  'flex items-center gap-2 text-sm font-medium leading-none select-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
);

/**
 * Local helm-style label directive applying spartan label class tokens.
 * Use as `<label hlmLabel for="…">`.
 */
@Directive({
  selector: 'label[hlmLabel]',
  host: {
    'data-slot': 'label',
    '[class]': 'hostClass',
  },
})
export class HlmLabel {
  protected readonly hostClass = LABEL_CLASS;
}
