import { BrnButton } from '@spartan-ng/brain/button';
import { computed, Directive, input } from '@angular/core';
import { hlm } from './hlm.util';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

const BUTTON_BASE =
  'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border ' +
  'border-transparent bg-clip-padding px-4 h-9 text-sm font-medium transition-all outline-none ' +
  'select-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ' +
  'disabled:pointer-events-none disabled:opacity-50';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border-border bg-background hover:bg-muted hover:text-foreground',
  ghost: 'hover:bg-muted hover:text-foreground',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  link: 'text-primary underline-offset-4 hover:underline',
};

/**
 * Local helm-style button directive. Hosts the brain `BrnButton` for disabled handling and
 * applies spartan button class tokens. Use as `<button hlmBtn variant="secondary">`.
 */
@Directive({
  selector: 'button[hlmBtn], a[hlmBtn]',
  exportAs: 'hlmBtn',
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    'data-slot': 'button',
    '[class]': 'computedClass()',
  },
})
export class HlmButton {
  readonly variant = input<ButtonVariant>('default');

  protected readonly computedClass = computed(() => hlm(BUTTON_BASE, BUTTON_VARIANTS[this.variant()]));
}
