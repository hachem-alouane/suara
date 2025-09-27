import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { TokenService } from '../../data/services/auth/token.service';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 403 &&
        err?.url?.includes('api/account')
      ) {
        tokenService.logout();
        router.navigate(['/login']);
      }
      throw err;
    })
  );
};
