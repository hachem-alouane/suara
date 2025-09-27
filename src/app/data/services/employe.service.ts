import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IEmploye } from '../../core/models/member.interface';
import { IUser } from '../../core/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2;

  getAll() {
    return this.http.get<IUser>(
      this.apiUrl + 'api/auth-v2/users/sorted-by-email'
    );
  }
}
