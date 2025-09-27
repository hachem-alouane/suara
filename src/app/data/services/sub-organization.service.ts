import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IOrganization } from '../../core/models/member.interface copy';

@Injectable({
  providedIn: 'root',
})
export class SubOrganizationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/ref-v2/';

  getById(id: number) {
    return this.http.get<IOrganization>(
      `${this.apiUrl}sous-organisation/${id}`
    );
  }

  add(organisation: IOrganization) {
    return this.http.post<IOrganization>(
      `${this.apiUrl}sous-organisation`,
      organisation
    );
  }

  update(id: number, organisation: IOrganization) {
    return this.http.put<IOrganization>(
      `${this.apiUrl}sous-organisation/${id}`,
      organisation
    );
  }
  getAll() {
    return this.http.get<IOrganization[]>(
      `${this.apiUrl}sous-organisation/all`
    );
  }
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}sous-organisation/${id}`, {
      responseType: 'text' as 'json',
    });
  }
  getSubOrganization() {
    return this.http.get<IOrganization[]>(
      `${this.apiUrl}sous-organisation/all`
    );
  }
  enableSubOrganization(id: number) {
    return this.http.patch(`${this.apiUrl}sous-organisation/${id}/enable`, {});
  }
  disableSubOrganization(id: number) {
    return this.http.patch(`${this.apiUrl}sous-organisation/${id}/disable`, {});
  }
}
