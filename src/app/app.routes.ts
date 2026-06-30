import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./registration/registration').then((m) => m.RegistrationComponent),
  },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
];
