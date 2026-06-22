import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'lxt-design-system-root',
  imports: [NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.disableTransitionOnLoad();
  }

  private disableTransitionOnLoad(): void {
    this.document.body.classList.add('preload');
    this.document.addEventListener('DOMContentLoaded', () => {
      this.document.body.classList.remove('preload');
    });
  }
}
