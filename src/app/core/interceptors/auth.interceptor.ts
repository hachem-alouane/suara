import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../data/services/auth/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  if (token) {
    return next(
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    );
  }
  return next(req);
};
