import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IGroup } from '../../core/models/member.interface copy';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/ref-v2/';

  getById(id: number) {
    return this.http.get<IGroup>(`${this.apiUrl}groupe-membre/${id}`);
  }

  add(group: IGroup) {
    return this.http.post<IGroup>(`${this.apiUrl}groupe-membre`, group);
  }

  update(id: number, group: IGroup) {
    return this.http.put<IGroup>(`${this.apiUrl}groupe-membre/${id}`, group);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}groupe-membre/${id}`, {
      responseType: 'text' as 'json',
    });
  }
  getGroup() {
    return this.http.get<IGroup[]>(`${this.apiUrl}groupe-membre/all`);
  }

  enableGroup(id: number) {
    return this.http.patch(`${this.apiUrl}groupe-membre/${id}/enable`, {});
  }
  disableGroup(id: number) {
    return this.http.patch(`${this.apiUrl}groupe-membre/${id}/disable`, {});
  }
  getAll() {
    return this.http.get<IGroup[]>(`${this.apiUrl}groupe-membre/all-member`);
  }
  getEmailsMemberByGroupId(id: number) {
    return this.http.get<string[]>(`${this.apiUrl}groupe-membre/${id}/emails`);
  }
}
