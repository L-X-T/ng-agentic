import { Directive } from '@angular/core';
import { hlm } from './hlm.util';

const CARD_CLASS = hlm('flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm');

const CARD_CONTENT_CLASS = hlm('px-6');

/**
 * Local helm-style card container directive applying spartan card class tokens.
 * Use as `<section hlmCard>`.
 */
@Directive({
  selector: '[hlmCard]',
  host: {
    'data-slot': 'card',
    '[class]': 'hostClass',
  },
})
export class HlmCard {
  protected readonly hostClass = CARD_CLASS;
}

/**
 * Local helm-style card content directive (horizontal padding).
 * Use as `<div hlmCardContent>`.
 */
@Directive({
  selector: '[hlmCardContent]',
  host: {
    'data-slot': 'card-content',
    '[class]': 'hostClass',
  },
})
export class HlmCardContent {
  protected readonly hostClass = CARD_CONTENT_CLASS;
}
