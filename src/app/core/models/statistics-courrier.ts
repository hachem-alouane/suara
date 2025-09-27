export interface ICourrier {
  priorite?: string;
  dateDebut?: string;
  dateFin?: string;
  etatCourrier?: string;
}
export interface IDemande {
  creePar?: string;
  creeParEmail?: string;
  destinataire?: string;
  destinataireEmail?: string;
  objetDeDerniereModification?: string;
  descriptionDeDerniereModification?: string;
  dateDeDerniereModification?: string; // or Date
}
export interface IStatCourrierPriorite {
  priorite: 'NORMALE' | 'URGENTE' | 'TRES_URGENTE';
  nombreCourrier: number;
}

export interface IStatDemandePriorite {
  priorite: string;
  nombredemande: number;
}
export interface IStatutDemandeCount {
  statut: string;
  count: number;
}
