/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DemandeService {
  private readonly http = inject(HttpClient);
  apiUrl = environment.SEREVER_AUTH_V2;

  addToBureauOrder(data: any) {
    return this.http.post(
      this.apiUrl + 'api/bureau-v2/demande/add-to-bureau-ordre',
      data
    );
  }
  addToCourrier(id: number, data: any) {
    return this.http.post(
      this.apiUrl + 'api/bureau-v2/demande/add-to-courrier/' + id,
      data
    );
  }
  addTraitementDemande(id: number, data: any) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/' + id + '/traite',
      data
    );
  }
  acceptDemande(id: number) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/' + id + '/accepter',
      {}
    );
  }
  refuserDemande(id: number) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/' + id + '/refuser',
      {}
    );
  }
  ciDemande(id: number, description: string) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/' + id + '/complement-information',
      { description }
    );
  }
  getDemandeById(id: number) {
    return this.http.get(this.apiUrl + 'api/bureau-v2/demande/' + id);
  }
  getSenderMail(id: number) {
    return this.http.get(
      this.apiUrl + 'api/bureau-v2/demande/' + id + '/destinataire-email',
      { responseType: 'text' as const }
    );
  }

  acceptDemandeBo(id: number) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/bureau-ordre/' + id + '/accepter',
      {}
    );
  }
  refuserDemandeBo(id: number) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/bureau-ordre/' + id + '/refuser',
      {}
    );
  }
  ciDemandeBo(id: number, description: string) {
    return this.http.put(
      this.apiUrl +
        'api/bureau-v2/demande/bureau-ordre/' +
        id +
        '/complement-information',
      { description }
    );
  }

  traitementDemande(id: number, data: any) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/demande/bureau-ordre/' + id + '/traiter',
      data
    );
  }
}
