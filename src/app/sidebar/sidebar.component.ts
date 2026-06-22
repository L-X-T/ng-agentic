import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@components/button';

@Component({
  selector: 'lxt-design-system-sidebar',
  imports: [RouterLink, ButtonComponent],
  styleUrls: ['./sidebar.component.scss'],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {}
