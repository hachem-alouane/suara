export interface IHistoriqueItem {
  creePar?: string;
  creeParEmail?: string;
  destinataire?: string;
  destinataireEmail?: string;
  objetDeDerniereModification?: string;
  descriptionDeDerniereModification?: string;
  dateDeDerniereModification?: string; // or Date if parsed
}

export interface ICourrierHistorique {
  creePar?: string;
  creeParEmail?: string;
  destinataire?: string;
  destinataireEmail?: string;
  objetDeDerniereModification?: string;
  descriptionDeDerniereModification?: string;
  dateDeDerniereModification?: string; // or Date
  historique?: IHistoriqueItem[];
}
