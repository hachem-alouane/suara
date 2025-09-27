import { Routes } from '@angular/router';
import { initAuthLanguage } from '../core/guards/init-auth-language.guard';
import { secureInnerPagesGuard } from '../core/guards/secure-inner-pages.guard';
export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    canActivate: [initAuthLanguage, secureInnerPagesGuard],

    loadComponent: () =>
      import('../core/layouts/layout-auth/layout-auth.component').then(
        (m) => m.LayoutAuthComponent
      ),
    children: [
      {
        path: 'forgot-password',
        title: 'FORGET_PASSWORD',
        loadComponent: () =>
          import('../auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        title: 'RESET_VERIFICATION_ACCOUNT',
        loadComponent: () =>
          import(
            '../auth/reset-verification-account/reset-verification-account.component'
          ).then((m) => m.ResetVerificationAccountComponent),
      },
      {
        path: 'verify-account',
        title: 'RESET_VERIFICATION_ACCOUNT',
        loadComponent: () =>
          import(
            '../auth/reset-verification-account/reset-verification-account.component'
          ).then((m) => m.ResetVerificationAccountComponent),
      },
      {
        path: 'login',
        title: 'LOGIN',
        loadComponent: () =>
          import('../auth/login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
];
