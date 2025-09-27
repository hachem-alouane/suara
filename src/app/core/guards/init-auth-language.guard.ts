import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { LocaleService } from '../../data/services/config/local.service';
import { Language } from '../enums/language.enum';
import { TokenService } from '../../data/services/auth/token.service';

export const initAuthLanguage: CanActivateFn = (_) => {
  const localeService = inject(LocaleService);
  const userAuthService = inject(UserAuthService);
  const tokenService = inject(TokenService);
  localeService.initLocale(tokenService.getLanguage() ?? Language.AR);
  userAuthService.changeCurrentLanguage(
    (tokenService.getLanguage() as Language) ?? Language.AR
  );

  return true;
};
