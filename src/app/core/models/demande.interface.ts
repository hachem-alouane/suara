export interface IDemande {
  id?: number;
  objet?: string;
  description?: string;
  priorite?: string;
  dateCreation?: string;
  statutDemande?: string;
  typeDemande?: string;
  creePar?: string;
  dateDerniereModification?: string;
  courrierId?: number;
  referenceDemande?: string;
}
