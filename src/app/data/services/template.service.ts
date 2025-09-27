import { inject, Injectable } from '@angular/core';
import {ITemplate } from '../../core/models/member.interface copy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

 private readonly http = inject(HttpClient);
   private readonly apiUrl = environment.SEREVER_AUTH_V2 + 'api/ref-v2/';
 
   getById(id: number) {
     return this.http.get<ITemplate>(`${this.apiUrl}modele/${id}`);
   }
 
   add(modele: ITemplate) {
     return this.http.post<ITemplate>(
       `${this.apiUrl}modele`,
       modele
     );
   }
 
   update(id: number, modele: ITemplate) {
     return this.http.put<ITemplate>(
       `${this.apiUrl}modele/${id}`,
       modele
     );
   }
 
   delete(id: number) {
     return this.http.delete(`${this.apiUrl}modele/${id}`, {
       responseType: 'text' as 'json',
     });
   }
   getModele() {
     return this.http.get<ITemplate[]>(`${this.apiUrl}modele/all`);
   }
 
   enableModele(id: number) {
     return this.http.patch(`${this.apiUrl}modele/${id}/enable`, {});
   }
   disableModele(id: number) {
     return this.http.patch(`${this.apiUrl}modele/${id}/disable`, {});
   }
}
