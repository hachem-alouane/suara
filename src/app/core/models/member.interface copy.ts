export interface IMembre {
  idMemebre?: number;
  adresseMembre?: string;
  adresseResponsableMembre?: string;
  capital?: number;
  descriptionMembre?: string;
  emailMembre?: string;
  emailResponsableMembre?: string;
  fait?: string;
  nomMembreArabosai?: string;
  prenomMembreArabosai?: string;
  nomResponsableMembre?: string;
  numFaxMembre?: string;
  numTelMembre?: string;
  numTelResponsableMembre?: string;
  poste?: string;
  statutMembre?: number;
  websiteMemebre?: string;
  email?: string[];
  nom?: string;
  adresse?: string;
  numTel?: string;
}

export interface IEmploye {
  idEmp?: number;
  adresseEmp?: string;
  cinEmp?: number;
  emailEmp?: string;
  etatCivilEmp?: string;
  hasUser?: number;
  matriculeEmp?: string;
  nomCompletEmp?: string;
  nomEmp?: string;
  numTelEmp?: number;
  prefix?: string;
  prenomEmp?: string;
  sexeEmp?: string;
  statutEmp?: string;
  prefixxPrefix?: string;
  membre?: IMembre;
}

export interface IPerson {
  idContact?: number;
  nomContact?: string;
  prenomContact?: string;
  adresseContact?: string;
  emailContact?: string;
  numTelContact?: number;
}
export interface IOrganization {
  idOrganisation?: number;
  organisationId?: number;
  nom?: string;
  adresse?: string;
  telephone?: string;
  statut?: string;
}
export interface ICountry {
  idPays?: number;
  codePays?: string;
  alpha2?: string;
  alpha3?: string;
  langGb?: string;
  langFr?: string;
  langAr?: string;
  statut?: string;
  sousOrganisationId?: string;
}

export interface IGroup {
  id?: number;
  code?: string;
  lib?: string;
  dateCreation?: Date;
  dateDelete?: Date;
  flag?: string;
  membreEmailsDtos?: IMembre[];
}
export interface ITemplate {
  id?: number;
  sujet?: string;
  contenu?: string;
  description?: string;
  langue?: string;
  statut?: string;
  creePar?: string;
  nombrePieceJointe?: number;
  dateCreation?: Date;
  dateModification?: Date;
}
