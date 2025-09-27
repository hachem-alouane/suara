/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  DestroyRef,
  inject,
  Injectable,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ScrollerOptions } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Direction } from '../../../../core/models/table/direction.enum';
import {
  ServiceType,
  TableType,
} from '../../../../core/models/table/table-type.enum';
import { ListOfHostUrls } from '../../../../data/constants/list.constants';
import { OrganizationService } from '../../../../data/services/organization.service';
import { PaginateService } from './paginate.service';

@Injectable()
export class DropdownPaginateService {
  private readonly paginateService = inject(PaginateService);
  private readonly organizationService = inject(OrganizationService);

  private _page = 0;
  private _limit = 10;
  private _itemSize = 0;
  private _firstTime = true;
  private _filterDropDown = '';
  private _serviceType = ServiceType.ORGANIZATION;
  private _hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
  private _sortBy = 'nom';
  private _myForm!: FormGroup;
  private _typeTable: TableType = TableType.ORGANIZATION;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private _dataList: any[] = [];
  readonly options: ScrollerOptions = {
    showLoader: false,
    lazy: true,
    onLazyLoad: this.onLazyLoad.bind(this),
  };
  private readonly parentContainer = inject(ControlContainer);

  initPaginate(tableType: TableType, myForm: FormGroup) {
    this._myForm = myForm;
    switch (tableType) {
      case TableType.ORGANIZATION:
        this._typeTable = TableType.ORGANIZATION;
        this._hostUrl = ListOfHostUrls['SEREVER_AUTH_V2'];
        this._serviceType = ServiceType.ORGANIZATION;
        this._sortBy = 'nom';
        break;

      default:
        break;
    }
    // this.paginateOrganisation(this.page, this.limit);
    this.listenToFilterChanges();
  }

  private clearPaginate() {
    this._page = 0;
    this._itemSize = 0;
    this._firstTime = true;
  }
  paginateOrganisation(
    page: number,
    limit: number,
    filter = '',
    setupFilter = false
  ) {
    this.paginateService
      .paginate(
        this.serviceType,
        {
          page,
          limit,
          filterDropDown: filter,
          statusFilter: 'ENABLED',
          direction: Direction.ASC,
          sortBy: 'nom',
        },
        this.hostUrl
      )
      .subscribe({
        next: (data) => {
          if (page >= 1) {
            this._dataList = [...this.dataList, ...data.table.data!];
          } else {
            this._dataList = data?.table?.data;
          }
          this._itemSize = data?.table?.meta?.totalElements;
          if (this.filterDropDown) this.cdr.markForCheck();
          if (setupFilter) {
            this._filterDropDown = filter ?? '';
            this.cdr.markForCheck();
          }
        },
      });
  }
  onLazyLoad(_: any) {
    if (this._dataList?.length <= this.itemSize - 1 || this.firstTime) {
      const pageSize = this.limit;
      this._page = this.page + 1;
      this.paginateOrganisation(this.page, pageSize, this.filterDropDown);
      this._firstTime = false;
    }
  }
  updateDropdownFilter(value: any) {
    switch (this.typeTable) {
      case TableType.ORGANIZATION:
        this.organizationService.getById(value).subscribe({
          next: (data: any) => {
            this._firstTime = true;
            this.clearPaginate();
            this.paginateOrganisation(
              this.page,
              this.limit,
              data?.nom ?? '',
              true
            );
            this.cdr.markForCheck();
          },
        });

        break;

      default:
        break;
    }
  }
  private listenToFilterChanges() {
    this.parentFormGroup?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this._filterDropDown = data?.filter ?? '';
        this.clearPaginate();
        this.paginateOrganisation(this.page, this.limit, this.filterDropDown);
        this.cdr.markForCheck();
      });
  }

  get parentFormGroup() {
    return this._myForm;
  }

  get page() {
    return this._page;
  }
  get limit() {
    return this._limit;
  }
  get itemSize() {
    return this._itemSize;
  }
  get filterDropDown() {
    return this._filterDropDown;
  }
  get firstTime() {
    return this._firstTime;
  }
  get dataList() {
    return this._dataList;
  }
  get serviceType() {
    return this._serviceType;
  }
  get hostUrl() {
    return this._hostUrl;
  }
  get sortBy() {
    return this._sortBy;
  }
  get typeTable() {
    return this._typeTable;
  }
  get parentOfParentFormGroup() {
    return this.parentContainer?.control as FormGroup; // Assuming parent form is FormGroup
  }
}
