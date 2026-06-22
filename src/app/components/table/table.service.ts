import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TableService {
  // Responsive design toggle button
  isMoreButtonClicked = signal(false);
}
