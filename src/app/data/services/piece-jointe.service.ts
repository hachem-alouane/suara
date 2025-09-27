import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDocument } from '../../core/models/document.interface';

@Injectable({
  providedIn: 'root',
})
export class PieceJointeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2;

  getAlldocumentsById(id: number) {
    return this.http.get<IDocument[]>(
      this.apiUrl + 'api/bureau-v2/piece-jointe/courrier/' + id
    );
  }
  getAlldocumentsToForwardById(id: number) {
    return this.http.get<IDocument[]>(
      this.apiUrl + 'api/bureau-v2/piece-jointe/courrier/' + id + '/to-forward'
    );
  }
  getAlldocumentsByIdDemande(id: number) {
    return this.http.get<IDocument[]>(
      this.apiUrl + 'api/bureau-v2/piece-jointe/demande/' + id
    );
  }
  preview(fileId: string) {
    return this.http.get(
      this.apiUrl + 'api/bureau-v2/piece-jointe/preview/' + fileId,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  getSignedUrl(fileId: string) {
    return this.http.get<{ url: string; contentType: string }>(
      this.apiUrl + 'api/bureau-v2/piece-jointe/signed-url/' + fileId
    );
  }
  downloadDocument(fileId: string) {
    const url = `${this.apiUrl}api/bureau-v2/piece-jointe/download/${fileId}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  getListePieceForCourrierDispatche(id: number) {
    return this.http.get<IDocument[]>(
      `${this.apiUrl}/get-listepiecedispatche/${id}`
    );
  }
  uploadMultiplePieceJointeByIdDemande(idDemande: number, files: File[]) {
    const formData = new FormData();
    if (files?.length) {
      files.forEach((file) => {
        formData.append('files ', file, file.name);
      });
    }
    return this.http.post(
      this.apiUrl +
        'api/bureau-v2/piece-jointe/demande/' +
        idDemande +
        '/upload-multiple',
      formData,
      { responseType: 'text' as const }
    );
  }
  addFileToForward(id: number) {
    return this.http.put(
      `${this.apiUrl}api/bureau-v2/piece-jointe/${id}/to-forward`,
      {}
    );
  }
  removeFileToForward(id: number) {
    return this.http.put(
      `${this.apiUrl}api/bureau-v2/piece-jointe/${id}/to-notForward`,
      {}
    );
  }
  deleePieceJointeById(id: number) {
    return this.http.delete(`${this.apiUrl}api/bureau-v2/piece-jointe/${id}`);
  }
  uploadMultiplePieceJointeByIdModel(idModel: number, files: File[]) {
    const formData = new FormData();
    if (files?.length) {
      files.forEach((file) => {
        formData.append('files ', file, file.name);
      });
    }
    return this.http.post(
      this.apiUrl +
        'api/bureau-v2/piece-jointe/model/' +
        idModel +
        '/upload-multiple',
      formData,
      { responseType: 'text' as const }
    );
  }
  getAlldocumentsByIdModel(id: number) {
    return this.http.get<IDocument[]>(
      this.apiUrl + 'api/bureau-v2/piece-jointe/model/' + id
    );
  }
}
