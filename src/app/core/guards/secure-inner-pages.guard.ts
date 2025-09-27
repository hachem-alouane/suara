import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../data/services/auth/token.service';
export const secureInnerPagesGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (tokenService.getToken()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
