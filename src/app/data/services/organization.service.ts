import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IOrganization } from '../../core/models/member.interface copy';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/ref-v2/';

  getById(id: number) {
    return this.http.get<IOrganization>(`${this.apiUrl}organisation/${id}`);
  }
  getAll() {
    return this.http.get<IOrganization[]>(`${this.apiUrl}organisation/all`);
  }
  add(organisation: IOrganization) {
    return this.http.post<IOrganization>(
      `${this.apiUrl}organisation`,
      organisation
    );
  }

  update(id: number, organisation: IOrganization) {
    return this.http.put<IOrganization>(
      `${this.apiUrl}organisation/${id}`,
      organisation
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}organisation/${id}`, {
      responseType: 'text' as 'json',
    });
  }
  getOrganization() {
    return this.http.get<IOrganization[]>(`${this.apiUrl}organisation/all`);
  }

  enableOrganization(id: number) {
    return this.http.patch(`${this.apiUrl}organisation/${id}/enable`, {});
  }
  disableOrganization(id: number) {
    return this.http.patch(`${this.apiUrl}organisation/${id}/disable`, {});
  }
}
