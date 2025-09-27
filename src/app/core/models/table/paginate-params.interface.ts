export interface IPaginateParams {
  page: number;
  limit: number;
  sortBy?: string;
  direction?: string;
  filter?: string;
  filterStatut?: boolean;
  filterStatus?: boolean;
  filterStartDate?: string;
  filterEndDate?: string;
  filterTypeTax?: string;
  filterTaxableBase?: string;
  filterCategoryProjet?: string;
  filterEtatCourrier?: string;
  filterSensCourrier?: string;
  filterPrioriteCourrier?: string;
  statusFilter?: string;
  filterDropDown?: string;
  priorite?: string;
}
