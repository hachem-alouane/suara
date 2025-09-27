import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./routing/back-office.root').then((mod) => mod.BACK_OFFICE_ROOT),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./routing/auth.rout').then((mod) => mod.AUTH_ROUTES),
  },
];
