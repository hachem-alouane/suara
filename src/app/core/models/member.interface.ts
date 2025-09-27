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
  email?: string;
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
export interface IModules {
  id?: number;
  name: string;
  permissions: IPermission[];
}
export interface IPermission {
  id?: number;
  name: string;
}
