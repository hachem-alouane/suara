import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IMeta } from '../../../../core/models/table/meta.interface';
import { IPaginateParams } from '../../../../core/models/table/paginate-params.interface';
import { ServiceType } from '../../../../core/models/table/table-type.enum';

@Injectable({
  providedIn: 'root',
})
export class PaginateService {
  private readonly http = inject(HttpClient);

  paginate(serviceType: ServiceType, params: IPaginateParams, hostUrl: string) {
    let urlRequest =
      hostUrl +
      'api/' +
      serviceType +
      '?page=' +
      Number(params.page) +
      '&limit=' +
      Number(params.limit);
    if (params.sortBy) urlRequest += '&sortBy=' + params.sortBy;
    if (params.direction) urlRequest += '&direction=' + params.direction;
    if (params.filter) urlRequest += '&filter=' + params.filter;
    if (params.filterStatut || params.filterStatut === false)
      urlRequest += '&filterStatut=' + params.filterStatut;
    if (params.filterStatus || params.filterStatus === false)
      urlRequest += '&filterStatus=' + params.filterStatus;
    if (params.filterStartDate)
      urlRequest +=
        '&filterStartDate=' +
        new Date(params.filterStartDate)?.toLocaleDateString();
    if (params.filterEndDate)
      urlRequest +=
        '&filterEndDate=' +
        new Date(params.filterEndDate)?.toLocaleDateString();
    if (params.filterEtatCourrier)
      urlRequest += '&etatCourrier=' + params.filterEtatCourrier;
    if (params.filterSensCourrier)
      urlRequest += '&sensCourrier=' + params.filterSensCourrier;
    if (params.filterPrioriteCourrier)
      urlRequest += '&prioriteCourrier=' + params.filterPrioriteCourrier;
    if (params.statusFilter)
      urlRequest += '&statusFilter=' + params.statusFilter;
    if (params.filterDropDown)
      urlRequest += '&filterDropDown=' + params.filterDropDown;
    if (params.priorite) urlRequest += '&priorite=' + params.priorite;

    return this.http
      .get<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table: { data: any[]; meta: IMeta };
      }>(urlRequest)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((response: any) => {
          return {
            table: {
              data: response?.['content'],
              meta: {
                page: response?.['number'],
                limit: response?.['size'],
                totalElements: response?.['totalElements'],
                totalPages: response?.['totalPages'],
                first: response?.['first'],
                last: response?.['last'],
              },
            },
          };
        })
      );
  }
}
