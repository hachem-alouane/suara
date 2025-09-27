/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { inject } from '@angular/core';
import { map, take, catchError, of } from 'rxjs';
import { IUser } from '../models/user.interface';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);

  const moduleName = route.data?.['module'] as string;

  return authService.currentUser.pipe(
    take(1),
    map((user: IUser | null) => {
      if (!user) {
        router.navigate(['/']);
        return false;
      }

      const hasModule = user.modules.some((m: any) => m.name === moduleName);

      if (!hasModule) {
        router.navigate(['/']);
      }

      return hasModule;
    }),
    catchError(() => of(false))
  );
};
