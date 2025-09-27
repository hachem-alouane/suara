import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConfirmationService, LazyLoadMeta } from 'primeng/api';
import { BasicTableType } from '../../../../core/enums/table-type.enum';
import { GlobalDataIncomingCorrespondence } from '../../../../data/constants/config-table.constants';

@Injectable()
export class BasicTableService {
  private _typeTable = BasicTableType.CONTACTS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _dataList$ = new BehaviorSubject<any[]>([]);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cdr = inject(ChangeDetectorRef);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _dataPopup: any = GlobalDataIncomingCorrespondence;

  initTable(tableType: BasicTableType) {
    switch (tableType) {
      case BasicTableType.CONTACTS:
        this._typeTable = BasicTableType.CONTACTS;
        this._dataPopup = GlobalDataIncomingCorrespondence;
        break;
      default:
        break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  lazy(_: LazyLoadMeta) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  trackByFunction = (index: number, item: any) => {
    return index;
  };

  get typeTable() {
    return this._typeTable;
  }

  get dataList() {
    return this._dataList$.asObservable();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeDataList(data: any[]) {
    this._dataList$.next(data);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushNewDataList(data: any) {
    this._dataList$.getValue()?.push(data);
    this.cdr.markForCheck();
  }

  get dataPopup() {
    return this._dataPopup;
  }
}
