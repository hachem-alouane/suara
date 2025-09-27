import { inject, Injectable } from '@angular/core';
import { ICountry } from '../../core/models/member.interface copy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/ref-v2/';

  getById(id: number) {
    return this.http.get<ICountry>(`${this.apiUrl}pays/${id}`);
  }

  add(organisation: ICountry) {
    return this.http.post<ICountry>(`${this.apiUrl}pays`, organisation);
  }
  getAll() {
    return this.http.get<ICountry[]>(`${this.apiUrl}pays/all`);
  }
  update(id: number, organisation: ICountry) {
    return this.http.put<ICountry>(`${this.apiUrl}pays/${id}`, organisation);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}pays/${id}`, {
      responseType: 'text' as 'json',
    });
  }
  getCountry() {
    return this.http.get<ICountry[]>(`${this.apiUrl}pays/all`);
  }

  enableCountry(id: number) {
    return this.http.patch(`${this.apiUrl}pays/${id}/enable`, {});
  }
  disableCountry(id: number) {
    return this.http.patch(`${this.apiUrl}pays/${id}/disable`, {});
  }
}
