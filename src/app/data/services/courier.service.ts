/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDemande } from '../../core/models/demande.interface';
import { ICourrierHistorique } from '../../core/models/historique-demande.interface';
import { ISensCr } from '../../core/models/sensr.interface';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private readonly http = inject(HttpClient);
  apiUrl = environment.SEREVER_AUTH_V2;
  getCourierById(id: number) {
    return this.http.get(this.apiUrl + 'api/bureau-v2/courrier/' + id);
  }
  getDemandeByIdCourrier(id: number) {
    return this.http.get<IDemande>(
      this.apiUrl + 'api/bureau-v2/demande/courrier/' + id
    );
  }
  getDemandeByIdDemande(id: number) {
    return this.http.get<ICourrierHistorique>(
      this.apiUrl +
        'api/bureau-v2/demande/' +
        id +
        '/historique-contenu-regroupe'
    );
  }
  getHistoriqueByIdDemande(id: number) {
    return this.http.get<ICourrierHistorique>(
      this.apiUrl + 'api/bureau-v2/demande/' + id + '/historique/global'
    );
  }
  rejectCourrierById(id: number) {
    return this.http.put<void>(
      `${this.apiUrl}api/bureau-v2/courrier/${id}/reject`,
      {}
    );
  }
  archive(id: number, priority: string) {
    return this.http.put(
      this.apiUrl + 'api/bureau-v2/courrier/' + id + '/archive',
      {
        priority,
      }
    );
  }
  // forwardEmaile(
  //   port: string,
  //   host: string,
  //   user: string,
  //   password: string,
  //   storeType: string,
  //   messageNumber: any,
  //   from: any,
  //   to: any,
  //   additionalText?: any,
  //   isHtml = false,
  //   id?: any,
  //   attachments?: any[]
  // ) {
  //   const formData: FormData = new FormData();
  //   formData.append('port', port);
  //   formData.append('host', host);
  //   formData.append('user', user);
  //   formData.append('password', password);
  //   formData.append('storeType', storeType);
  //   formData.append('messageNumber', messageNumber.toString());
  //   formData.append('from', from);
  //   formData.append('to', to.toString());
  //   formData.append('isHtml', isHtml.toString());
  //   formData.append('id', id);

  //   if (additionalText) {
  //     formData.append('additionalText', additionalText);
  //   }

  //   // Append files if any
  //   if (attachments) {
  //     attachments.forEach((file) => {
  //       formData.append('attachments', file, file.name);
  //     });
  //   }

  //   const api = environment.EMAIL_SERVICE_URL + '/forward';

  //   return this.http.post<string>(api, formData, {
  //     responseType: 'Text ' as 'json',
  //   });
  // }
  forwardEmaile(
    idCourrier: number,
    to: string,
    message: string,
    files: File[]
  ) {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('message', message);
    if (files?.length) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
    return this.http.post(
      this.apiUrl + 'api/bureau-v2/courrier/' + idCourrier + '/forward',
      formData,
      { responseType: 'text' as const }
    );
  }
  getListeCourrierForUser(idUser: string) {
    return this.http.get(`${this.apiUrl}/get-listecourrier-foruser/${idUser}`);
  }

  getcourrier(id: any) {
    return this.http.get(`${this.apiUrl}/getcourrier/${id}`);
  }
  getAllSensCourrier() {
    return this.http.get<ISensCr[]>(`${this.apiUrl}/all-sens-courrier`);
  }
  seen(id: number) {
    return this.http.put(`${this.apiUrl}api/bureau-v2/courrier/${id}/seen`, {});
  }

  sendAcceptedMail(
    demandeId: string,
    destinataires: string,
    objet: string,
    contenu: string,
    files: File[]
  ) {
    const formData = new FormData();
    if (files?.length) {
      files.forEach((file) => {
        formData.append('fichiers', file, file.name);
      });
    }
    formData.append(`destinataires`, destinataires);
    formData.append('objet', objet);
    formData.append('contenu', contenu);
    formData.append('demandeId', demandeId);
    return this.http.post(
      this.apiUrl + 'api/bureau-v2/courrier/send-accepted-courrier',
      formData,
      { responseType: 'text' as const }
    );
  }
  sendAcceptedMailIntern(
    demandeId: string,
    destinataires: string[],
    objet: string,
    contenu: string,
    files: File[]
  ) {
    const formData = new FormData();
    if (files?.length) {
      files.forEach((file) => {
        formData.append('fichiers', file, file.name);
      });
    }
    if (destinataires?.length) {
      destinataires.forEach((destinataire) => {
        formData.append('destinataires', destinataire);
      });
    }
    formData.append('objet', objet);
    formData.append('contenu', contenu);
    formData.append('demandeId', demandeId);
    return this.http.post(
      this.apiUrl + 'api/bureau-v2/courrier/send-accepted-courrier-bo',
      formData,
      { responseType: 'text' as const }
    );
  }
  writeMessageAdmin(
    destinataires: string[],
    objet: string,
    contenu: string,
    files: File[]
  ) {
    const formData = new FormData();
    if (files?.length) {
      files.forEach((file) => {
        formData.append('fichiers', file, file.name);
      });
    }
    if (destinataires?.length) {
      destinataires.forEach((destinataire) => {
        formData.append('destinataires', destinataire);
      });
    }
    formData.append('objet', objet);
    formData.append('contenu', contenu);
    return this.http.post(
      this.apiUrl + 'api/bureau-v2/courrier/send-courrier-sans-demande',
      formData,
      { responseType: 'text' as const }
    );
  }
  changeStatusFromRejecteToEnAttente(id: number) {
    return this.http.patch(
      `${this.apiUrl}api/bureau-v2/courrier/${id}/statut/rejete-vers-en-attente`,
      {}
    );
  }
  historyCourrier(id: number, language: string) {
    return this.http.get<string[]>(
      `${this.apiUrl}api/bureau-v2/courrier/historique/suivi-courrier/${id}?lang=${language}`,
      {}
    );
  }
}
