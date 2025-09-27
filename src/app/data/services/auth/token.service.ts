import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { Language } from '../../../core/enums/language.enum';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(this.isValid());
  private readonly userAuthService = inject(UserAuthService);

  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }
  getToken() {
    return localStorage.getItem('authToken');
  }
  removeToken() {
    localStorage.removeItem('authToken');
  }
  setRefreshToken(refreshToken: string) {
    localStorage.setItem('authRefreshToken', refreshToken);
  }
  getRefreshToken() {
    return localStorage.getItem('authRefreshToken');
  }
  removeRefreshToken() {
    localStorage.removeItem('authRefreshToken');
  }
  setLanguage(language: Language) {
    localStorage.setItem('Language', language);
  }
  getLanguage() {
    return localStorage.getItem('Language');
  }
  removeLanguage() {
    localStorage.removeItem('Language');
  }
  changeAuthStatus(value: boolean) {
    this.loggedIn$.next(value);
  }
  get isLoggedIn() {
    return this.loggedIn$.asObservable();
  }
  isValid() {
    const token = this.getToken();
    if (token) return true;
    return false;
  }
  logout() {
    this.removeToken();
    this.removeRefreshToken();
    this.changeAuthStatus(false);
    this.userAuthService.changeCurrentUser(null);
  }
}
