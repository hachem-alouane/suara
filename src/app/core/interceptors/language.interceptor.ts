/* eslint-disable @typescript-eslint/no-explicit-any */

import { TokenService } from '../../data/services/auth/token.service';

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Language } from '../enums/language.enum';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  const lang = tokenService.getLanguage() ?? Language.AR;

  if (lang) {
    return next(
      req.clone({
        headers: req.headers.set('Accept-Language', lang),
      })
    );
  }

  return next(req);
};
