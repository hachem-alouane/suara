import { DestroyRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
export const IsAdminGuard: CanActivateFn = (_) => {
  const router = inject(Router);
  const userAuthService = inject(UserAuthService);
  const destroyRef = inject(DestroyRef);
  return false;

  // return userAuthService.currentUser.pipe(
  //   takeUntilDestroyed(destroyRef),
  //   map((user) => {
  //     if (user?.authorities?.[0] === Role.ROLE_ADMIN) return true;
  //     router.navigate(['/error404']);
  //     return false;
  //   })
  // );
};
