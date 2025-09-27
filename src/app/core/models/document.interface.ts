export interface IDocument {
  id?: number;
  code?: string;
  nom?: string;
  taille?: string;
  type?: string;
  statut?: 'ACTIF' | 'INACTIF'; // You can adjust this union if there are other possible statuses
  fileId?: string;
  idCourrier?: number;
  dateCreation?: string; // You can change to Date if you parse it
  downloadUrl?: string;
  previewUrl?: string;
  toForward?: boolean;
}
