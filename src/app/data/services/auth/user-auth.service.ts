/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Language } from '../../../core/enums/language.enum';
import { IUser } from '../../../core/models/user.interface';
import { PrimeNG } from 'primeng/config';
import { PRIMENG_LOCALES } from '../../constants/theme.constants';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUser$ = new BehaviorSubject<IUser | null>(null);
  private readonly currentLanguage$ = new BehaviorSubject<string>(Language.AR);
  private readonly primeng = inject(PrimeNG);

  authUrl = environment.SEREVER_AUTH_V2;
  get currentUser() {
    return this.currentUser$.asObservable();
  }

  changeCurrentUser(currentUser: IUser | null) {
    this.currentUser$.next(currentUser);
  }
  get currentLanguage() {
    return this.currentLanguage$.asObservable();
  }

  changeCurrentLanguage(currentLanguage: Language) {
    this.currentLanguage$.next(currentLanguage);
    this.primeng.setTranslation(PRIMENG_LOCALES[currentLanguage]);
  }
  me() {
    return this.http.get<IUser>(this.authUrl + 'api/auth-v2/users/me');
  }
  // login(data:any) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login(username: string, password: string) {
    return this.http.post(this.authUrl + 'api/auth-v2/auth/login', {
      username,
      password,
    });
  }
  updateUser(data: any, idUser: string) {
    return this.http.put(this.authUrl + 'api/auth-v2/users/' + idUser, data);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUser(data: any) {
    return this.http.post(this.authUrl + 'api/auth-v2/users', data);
  }
  getUserById(id: number) {
    return this.http.get<IUser>(`${this.authUrl}api/auth-v2/users/${id}`);
  }
  blockUserById(id: number, isBlocked: boolean) {
    return this.http.put<IUser>(
      `${this.authUrl}api/auth-v2/users/${id}/block`,
      {
        block: isBlocked,
      }
    );
  }
  forgotPassword(payload: { email: string }) {
    return this.http.post(
      `${this.authUrl}api/auth-v2/forgot-password?email=${payload.email}`,
      {}
    );
  }
  resetPassword(token: string, newPassword: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // token in header
    });
    return this.http.post(
      `${this.authUrl}api/auth-v2/reset-password?token=${encodeURIComponent(
        token
      )}`,
      newPassword,
      { headers }
    );
  }
  verificationAccont(token: string, newPassword: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // token in header
    });
    return this.http.post(
      `${this.authUrl}api/auth-v2/verify-account?token=${encodeURIComponent(
        token
      )}`,
      newPassword,
      { headers }
    );
  }
  getAllRoles() {
    return this.http.get(this.authUrl + 'api/auth-v2/admin/roles');
  }
}
