import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@components/button';

@Component({
  selector: 'lxt-design-system-navbar',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  openLxt(): void {
    window.open('https://lxt.dev/', '_blank');
  }
}
