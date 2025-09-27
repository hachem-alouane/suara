/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IModules } from '../../core/models/member.interface';
import { IRole } from '../../core/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/auth-v2/admin/';

  getModulesPermissions() {
    return this.http.get<IModules[]>(`${this.apiUrl}modules`);
  }
  getModulesPermissionsByRole(role: string) {
    return this.http.get<IModules[]>(
      `${this.apiUrl}module-by-role?roleName=${role}`
    );
  }
  getModulesByUserId(userId: string) {
    return this.http.get<IModules[]>(`${this.apiUrl}user-modules/${userId}`);
  }
  assignPermissions(userId: string, permissions: any[]) {
    return this.http.post<IModules[]>(
      `${this.apiUrl}assign-multiple-user-module-permissions/${userId}`,
      permissions,
      { responseType: 'text' as 'json' }
    );
  }
}
