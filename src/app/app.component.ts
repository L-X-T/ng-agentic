import { ChangeDetectionStrategy, Component, DOCUMENT, inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'lxt-design-system-root',
  imports: [NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.disableTransitionOnLoad();
  }

  private disableTransitionOnLoad(): void {
    const removePreload = (): void => this.document.body.classList.remove('preload');
    this.document.body.classList.add('preload');
    // If the DOM is already loaded (e.g. late bootstrap), DOMContentLoaded will
    // never fire again and the class would suppress all transitions forever.
    if (this.document.readyState === 'loading') {
      this.document.addEventListener('DOMContentLoaded', removePreload, { once: true });
    } else {
      removePreload();
    }
  }
}
