/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  DestroyRef,
  inject,
  Injectable,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { LazyLoadMeta, SortMeta } from 'primeng/api';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';

import { PaginatorState } from 'primeng/paginator';
import { Direction } from '../../../../core/models/table/direction.enum';
import { IMeta } from '../../../../core/models/table/meta.interface';
import { IPaginateParams } from '../../../../core/models/table/paginate-params.interface';
import { ISortOrderNgPrime } from '../../../../core/models/table/sort-order-ngprime.enum';
import {
  ServiceType,
  TableType,
} from '../../../../core/models/table/table-type.enum';
import {
  GlobalDataIncomingCorrespondence,
  GlobalDataOrganization,
  GlobalDataOrganizations,
} from '../../../../data/constants/config-table.constants';
import { ListOfHostUrls } from '../../../../data/constants/list.constants';
import { PaginateService } from './paginate.service';
import { UserAuthService } from '../../../../data/services/auth/user-auth.service';
import { IUser } from '../../../../core/models/user.interface';
import { Role } from '../../../../core/enums/role.enum';

@Injectable()
export class TableService {
  private readonly paginateService = inject(PaginateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly userAuthService = inject(UserAuthService);
  private _myForm!: FormGroup;
  private _currentUser: IUser | null = null;
  private _dataPopup: any = GlobalDataIncomingCorrespondence;
  private _hostUrl: any =
    ListOfHostUrls['SEREVER_AUTH_V2'] || ListOfHostUrls['DEFAULT'];

  private readonly _paramsPaginator: IPaginateParams = {
    page: 0,
    limit: 10,
    sortBy: '',
    direction: '',
    filter: this.filter?.value,
    filterStatut: this.filterStatut?.value,
    filterStatus: this.filterStatus?.value,
    filterStartDate: this.filterStartDate?.value,
    filterEndDate: this.filterEndDate?.value,
    filterTypeTax: this.filterTypeTax?.value,
    filterTaxableBase: this.filterTaxableBase?.value,
    priorite: this.priorite?.value,
    statusFilter: this.statusFilter?.value,
    filterPrioriteCourrier: this.filterPrioriteCourrier?.value,
    filterCategoryProjet: this.filterCategoryProjet?.value,
    filterEtatCourrier: '',
    filterSensCourrier: '',
  };
  private _sortField = '';
  private _sortOrder = 1;
  private _first = 0;
  private _typeTable = TableType.INCOMING_CORRESPONDENCE;
  private _apiUrl = ServiceType.INCOMING_CORRESPONDENCE;
  private _dataList$ = new Observable<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: { data: any[]; meta: IMeta };
  }>();
  private _loading = false;
  initTable(tableType: TableType, myForm: FormGroup) {
    this._myForm = myForm;
    // this.setDataList();
    this.listenToCurrentUser(tableType);
    this.listenToFiltersChanges();
    this.listenToFilterSearchChanges();
  }
  private listenToCurrentUser(tableType: TableType) {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this._currentUser = user;
        this.initDataTable(tableType);
      });
  }
  private initDataTable(tableType: TableType) {
    switch (tableType) {
      case TableType.INCOMING_CORRESPONDENCE:
        this._typeTable = TableType.INCOMING_CORRESPONDENCE;
        this._apiUrl = ServiceType.INCOMING_CORRESPONDENCE;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        // this.paramsPaginator.filterEtatCourrier = 'EN_ATTENTE';
        // this.paramsPaginator.filterSensCourrier = 'ENTRANT';

        break;
      case TableType.ARCHIVED_CORRESPONDENCE:
        this._typeTable = TableType.ARCHIVED_CORRESPONDENCE;
        this._apiUrl = ServiceType.ARCHIVED_CORRESPONDENCE;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;
      case TableType.OUTGOING_CORRESPONDENCE:
        this._typeTable = TableType.OUTGOING_CORRESPONDENCE;
        this._apiUrl = ServiceType.OUTGOING_CORRESPONDENCE;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;
      case TableType.DISTRIBUTED_CORRESPONDENCE:
        this._typeTable = TableType.DISTRIBUTED_CORRESPONDENCE;
        this._apiUrl = ServiceType.DISTRIBUTED_CORRESPONDENCE;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;
      case TableType.USERS:
        this._typeTable = TableType.USERS;
        this._apiUrl = ServiceType.USERS;
        this._dataPopup = GlobalDataOrganization;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        break;
      case TableType.REGISTRY_REQUEST:
        this._typeTable = TableType.REGISTRY_REQUEST;
        this._apiUrl =
          this.currentUser?.role?.name === Role.SUPERADMIN ||
          this.currentUser?.role?.name === Role.ADMIN
            ? ServiceType.REGISTRY_REQUEST
            : ServiceType.REGISTRY_REQUEST_EMPLOYER;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        break;
      case TableType.ORGANIZATION:
        this._typeTable = TableType.ORGANIZATION;
        this._apiUrl = ServiceType.ORGANIZATION;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        break;
      case TableType.SUB_ORGANIZATION:
        this._typeTable = TableType.SUB_ORGANIZATION;
        this._apiUrl = ServiceType.SUB_ORGANIZATION;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        break;
      case TableType.ACCEPTED_MAIL_LIST:
        this._typeTable = TableType.ACCEPTED_MAIL_LIST;
        this._apiUrl = ServiceType.ACCEPTED_MAIL_LIST;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        // this.paramsPaginator.filterEtatCourrier = 'EN_ATTENTE';
        // this.paramsPaginator.filterSensCourrier = 'ENTRANT';

        break;
      case TableType.COUNTRY:
        this._typeTable = TableType.COUNTRY;
        this._apiUrl = ServiceType.COUNTRY;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        // this.paramsPaginator.filterEtatCourrier = 'EN_ATTENTE';
        // this.paramsPaginator.filterSensCourrier = 'ENTRANT';

        break;
      case TableType.MEMBER:
        this._typeTable = TableType.MEMBER;
        this._apiUrl = ServiceType.MEMBER;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;
      case TableType.GROUP:
        this._typeTable = TableType.GROUP;
        this._apiUrl = ServiceType.GROUP;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;
      case TableType.RECYCLE_BIN:
        this._typeTable = TableType.RECYCLE_BIN;
        this._apiUrl = ServiceType.RECYCLE_BIN;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        break;
      case TableType.MAIL_TEMPLATE:
        this._typeTable = TableType.MAIL_TEMPLATE;
        this._apiUrl = ServiceType.MAIL_TEMPLATE;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;
      case TableType.CORRESPONDENCE_FOLLOW_UP:
        this._typeTable = TableType.CORRESPONDENCE_FOLLOW_UP;
        this._apiUrl = ServiceType.CORRESPONDENCE_FOLLOW_UP;
        this._dataPopup = GlobalDataOrganizations;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];

        break;

      default:
        break;
    }
  }
  lazy(event: LazyLoadMeta) {
    // this._sortField = Array.isArray(event.sortField)
    //   ? event.sortField[0] ?? ''
    //   : event.sortField ?? '';
    // this._sortOrder = event.sortOrder!;
  }

  sort(event: SortMeta) {
    this._paramsPaginator.sortBy =
      event?.field === 'priorite' &&
      (this.typeTable === TableType.ARCHIVED_CORRESPONDENCE ||
        this.typeTable === TableType.DISTRIBUTED_CORRESPONDENCE ||
        this.typeTable === TableType.OUTGOING_CORRESPONDENCE)
        ? 'prioriteCourrier'
        : event?.field ?? '';
    if (ISortOrderNgPrime.ASC === event.order)
      this._paramsPaginator.direction = Direction.ASC;
    if (ISortOrderNgPrime.DESC === event.order)
      this._paramsPaginator.direction = Direction.DESC;

    this.setDataList();
  }
  clear() {
    this._sortField = '';
    this._sortOrder = 1;
    this.paramsPaginator.sortBy = '';
    this.paramsPaginator.direction = '';
    this.paramsPaginator.page = 0;
    this.paramsPaginator.limit = 10;
    this._first = 0;
    this.setDataList();
  }
  onPageChange(event: PaginatorState) {
    this.paramsPaginator.page = event?.page ?? 0;
    this.paramsPaginator.limit = event?.rows ?? 10;
    this._first = event?.first ?? 0;
    this.setDataList();
  }
  trackByFunction = (_: number, item: any) => {
    return item?.id;
  };
  setDataList() {
    this._dataList$ = this.paginate(this.apiUrl, this.paramsPaginator);
    this.cd.markForCheck();
  }
  rowClass(value: any) {
    switch (this.typeTable) {
      case TableType.ORGANIZATION:
        return {
          'table-disable-custom': value?.statut === 'DISABLED',
        };
      case TableType.SUB_ORGANIZATION:
        return {
          'table-disable-custom': value?.statut === 'DISABLED',
        };
      case TableType.COUNTRY:
        return {
          'table-disable-custom': value?.statut === 'DISABLED',
        };
      case TableType.MEMBER:
        return {
          'table-disable-custom': value?.statut === 'DISABLED',
        };
      case TableType.GROUP:
        return {
          'table-disable-custom': value?.flag === 'DISABLED',
        };
      case TableType.INCOMING_CORRESPONDENCE:
        return {
          'font-boldd': value?.seen === false,
        };
      case TableType.ARCHIVED_CORRESPONDENCE:
        return {
          'font-boldd': value?.seen === false,
        };
      case TableType.DISTRIBUTED_CORRESPONDENCE:
        return {
          'font-boldd': value?.seen === false,
        };
      case TableType.OUTGOING_CORRESPONDENCE:
        return {
          'font-boldd': value?.seen === false,
        };
      case TableType.REGISTRY_REQUEST:
        return {
          'font-boldd': value?.seen === false,
        };
      case TableType.ACCEPTED_MAIL_LIST:
        return {
          'font-boldd': value?.seen === false,
        };
      case TableType.MAIL_TEMPLATE:
        return {
          'table-disable-custom': value?.statut === 'DISABLED',
        };
      default:
        return {};
    }
  }
  private paginate(apiUrl: ServiceType, params: IPaginateParams) {
    this._loading = true;
    return this.paginateService.paginate(apiUrl, params, this.hostUrl).pipe(
      finalize(() => {
        this._loading = false;
        setTimeout(() => {
          // this.cd.markForCheck();
        }, 100);
      }),
      shareReplay(1)
    );
  }
  private listenToFiltersChanges() {
    this.parentFormGroup?.valueChanges
      ?.pipe(
        startWith(this.parentFormGroup.value),
        map((formValue) => {
          const { search, ...rest } = formValue;
          return rest;
        }),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this._paramsPaginator.filterStatut = data?.statut;
        this._paramsPaginator.statusFilter = data?.statusFilter;
        this._paramsPaginator.filterStatus = data?.filterStatus;
        this._paramsPaginator.filterStartDate = data?.startDate;
        this._paramsPaginator.filterEndDate = data?.endDate;
        this._paramsPaginator.filterPrioriteCourrier = data?.prioriteCourrier;
        this._paramsPaginator.filterTypeTax = data?.typeTax;
        this._paramsPaginator.priorite = data?.priorite;
        this._paramsPaginator.filterTaxableBase = data?.taxableBase;
        this._paramsPaginator.filterCategoryProjet = data?.filterCategoryProjet;
        this.setDataList();
      });
  }

  private listenToFilterSearchChanges() {
    this.filter?.valueChanges
      ?.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.paramsPaginator.filter = data;
        this.setDataList();
      });
  }
  get parentFormGroup() {
    return this._myForm;
  }

  get page() {
    return this.paramsPaginator.page;
  }
  get limit() {
    return this.paramsPaginator.limit;
  }
  get sortBy() {
    return this.paramsPaginator.sortBy;
  }
  get direction() {
    return this.paramsPaginator.direction;
  }
  get sortField() {
    return this._sortField;
  }
  get sortOrder() {
    return this._sortOrder;
  }
  get first() {
    return this._first;
  }
  get typeTable() {
    return this._typeTable;
  }
  get apiUrl() {
    return this._apiUrl;
  }
  get dataList() {
    return this._dataList$;
  }
  get currentUser() {
    return this._currentUser;
  }

  get filter() {
    return this.parentFormGroup?.get('search');
  }
  get filterStatut() {
    return this.parentFormGroup?.get('statut');
  }
  get filterStatus() {
    return this.parentFormGroup?.get('filterStatus');
  }
  get filterCategoryProjet() {
    return this.parentFormGroup?.get('filterCategoryProjet');
  }
  get filterTypeTax() {
    return this.parentFormGroup?.get('filterTypeTax');
  }
  get filterTaxableBase() {
    return this.parentFormGroup?.get('filterTaxableBase');
  }
  get statusFilter() {
    return this.parentFormGroup?.get('statusFilter');
  }
  get priorite() {
    return this.parentFormGroup?.get('priorite');
  }
  get filterStartDate() {
    return this.parentFormGroup?.get('startDate');
  }
  get filterPrioriteCourrier() {
    return this.parentFormGroup?.get('prioriteCourrier');
  }
  get filterEndDate() {
    return this.parentFormGroup?.get('endDate');
  }
  get paramsPaginator() {
    return this._paramsPaginator;
  }
  get dataPopup() {
    return this._dataPopup;
  }
  get loading() {
    return this._loading;
  }
  get hostUrl() {
    return this._hostUrl;
  }
}
