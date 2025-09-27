import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../data/services/auth/token.service';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { LocaleService } from '../../data/services/config/local.service';
import { Language } from '../enums/language.enum';
import { catchError, map, of, take } from 'rxjs';
import { IUser } from '../models/user.interface';

export const initUserGuard: CanActivateFn = (_) => {
  const localeService = inject(LocaleService);
  const userAuthService = inject(UserAuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (tokenService.isValid()) {
    localeService.initLocale(tokenService.getLanguage() ?? Language.AR);
    userAuthService.changeCurrentLanguage(
      (tokenService.getLanguage() as Language) ?? Language.AR
    );
    return userAuthService.me().pipe(
      take(1),
      map((user: IUser) => {
        tokenService.changeAuthStatus(true);
        userAuthService.changeCurrentUser(user);
        return true;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
  router.navigate(['/auth/login']);
  return false;
};
