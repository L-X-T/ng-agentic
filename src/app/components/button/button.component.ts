import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
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
})
export class ButtonComponent implements AfterContentInit {
  private readonly elRef = inject(ElementRef);

  @Input() @HostBinding('class') buttonType: ButtonType = 'primary';
  @Input() @HostBinding('class.destructive') destructive = false;
  @Input() @HostBinding('class.icon-only') iconOnly = false;

  ngAfterContentInit(): void {
    this.setTooltip();
  }

  // If the button has ellipsed text, show full text in the title on hover
  private setTooltip() {
    const contentWithLabel = this.elRef.nativeElement.querySelector('.label');
    if (!contentWithLabel) {
      return;
    }
    if (contentWithLabel.offsetWidth < contentWithLabel.scrollWidth) {
      contentWithLabel.setAttribute('title', contentWithLabel.textContent);
    }
  }
}
