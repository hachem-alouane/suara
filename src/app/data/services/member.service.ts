import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IMembre } from '../../core/models/member.interface copy';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/ref-v2/';

  getById(id: number) {
    return this.http.get<IMembre>(`${this.apiUrl}membre/${id}`);
  }
  getAll() {
    return this.http.get<IMembre[]>(`${this.apiUrl}membre/all`);
  }
  add(membre: IMembre) {
    return this.http.post<IMembre>(`${this.apiUrl}membre`, membre);
  }

  update(id: number, membre: IMembre) {
    return this.http.put<IMembre>(`${this.apiUrl}membre/${id}`, membre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}membre/${id}`, {
      responseType: 'text' as 'json',
    });
  }
  getMember() {
    return this.http.get<IMembre[]>(`${this.apiUrl}membre/all`);
  }

  enableMember(id: number) {
    return this.http.patch(`${this.apiUrl}membre/${id}/enable`, {});
  }
  disableMember(id: number) {
    return this.http.patch(`${this.apiUrl}membre/${id}/disable`, {});
  }
}
