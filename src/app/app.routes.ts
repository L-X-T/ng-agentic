import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full',
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./components-demo/button-demo/button-demo.component').then((m) => m.ButtonDemoComponent),
  },
  {
    path: 'table',
    loadComponent: () => import('./components-demo/table-demo/table-demo.component').then((m) => m.TableDemoComponent),
  },
];
