import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

export type ButtonType = 'primary' | 'outline' | 'ghost';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[lxt-button]',
  template: '<ng-content />',
  styleUrls: ['button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'buttonType()',
    '[class.destructive]': 'destructive()',
    '[class.icon-only]': 'iconOnly()',
  },
})
export class ButtonComponent {
  private readonly elRef = inject(ElementRef);

  readonly buttonType = input<ButtonType>('primary');
  readonly destructive = input(false);
  readonly iconOnly = input(false);

  constructor() {
    // Measure after the first render - projected content has laid out by then,
    // unlike in ngAfterContentInit, and this never runs on the server.
    afterNextRender(() => this.setTooltip());
  }

  // If the button has ellipsed text, show full text in the title on hover
  private setTooltip(): void {
    const contentWithLabel = this.elRef.nativeElement.querySelector('.label');
    if (!contentWithLabel) {
      return;
    }
    if (contentWithLabel.offsetWidth < contentWithLabel.scrollWidth) {
      contentWithLabel.setAttribute('title', contentWithLabel.textContent);
    }
  }
}
