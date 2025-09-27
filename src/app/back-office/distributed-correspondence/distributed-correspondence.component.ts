/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { LocaleService } from '../../data/services/config/local.service';
import { CourierService } from '../../data/services/courier.service';
import { SseService } from '../../data/services/sse.service';
import { BasicTableComponent } from '../../shared/ui/basic-table/basic-table.component';
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TableComponent } from '../../shared/ui/table/table.component';
import { AddRequestComponent } from './add-request/add-request.component';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';

@Component({
  selector: 'app-distributed-correspondence',
  standalone: true,
  imports: [
    TableComponent,
    TranslateModule,
    SvgIconComponent,
    DropdownComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    BasicTableComponent,
    DatePickerComponent,
  ],
  templateUrl: './distributed-correspondence.component.html',
  styleUrl: './distributed-correspondence.component.scss',
  providers: [DialogService, DialogUtilsService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributedCorrespondenceComponent
  implements AfterViewInit, OnInit
{
  @ViewChild('table') table!: TableComponent;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly courierService = inject(CourierService);
  readonly userAuthService = inject(UserAuthService);
  readonly destroyRef = inject(DestroyRef);
  readonly cdr = inject(ChangeDetectorRef);
  readonly sseService = inject(SseService);
  readonly router = inject(Router);
  ref!: DynamicDialogRef;

  columns: ICols[] = [
    {
      header: 'MESSAGE_NUMBER',
      field: 'referenceCourrier',
      type: TableType.DISTRIBUTED_CORRESPONDENCE,
    },

    {
      header: 'SENDER',
      field: 'expediteur',
      type: TableType.DISTRIBUTED_CORRESPONDENCE,
      ltr: true,
    },
    {
      header: 'RECIPIENTS',
      field: 'destinataire',
      type: TableType.DISTRIBUTED_CORRESPONDENCE,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'CORRESPONDENCE_DATE',
      field: 'dateReception',
      type: TableType.DISTRIBUTED_CORRESPONDENCE,
      extras: ExtrasColumn.DATE,
    },
    {
      header: 'NOTES',
      field: 'priorite',
      type: TableType.DISTRIBUTED_CORRESPONDENCE,
      extras: ExtrasColumn.BADGE,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.DISTRIBUTED_CORRESPONDENCE,
    },
  ];
  private readonly fb = inject(NonNullableFormBuilder);
  myForm = this.fb.group({});
  listOfProrities = [
    {
      id: 1,
      name: this.localeService.translate('NORMAL'),
      value: 'NORMALE',
    },
    {
      id: 2,
      name: this.localeService.translate('URGENT'),
      value: 'URGENTE',
    },
    {
      id: 3,
      name: this.localeService.translate('VERY_URGENT'),
      value: 'TRES_URGENTE',
    },
  ];
  actionsTable: ActionMenuType[] = [];

  ngAfterViewInit(): void {
    this.table.tableService.initTable(
      TableType.DISTRIBUTED_CORRESPONDENCE,
      this.myForm
    );
    this.listenToNewNotif();
  }
  ngOnInit(): void {
    this.listenToCurrentUser();
  }
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canView = hasModulePermission(
          'DISTRIBUTED_CORRESPONDENCE',
          'VIEW'
        );
        const canRequest = hasModulePermission(
          'DISTRIBUTED_CORRESPONDENCE',
          'REQUEST'
        );

        if (canView(user?.modules ?? [])) this.actionsTable.push('view');
        if (canRequest(user?.modules ?? [])) {
          this.actionsTable.push('add-request');
          this.actionsTable.push('processing-request');
        }
      });
  }
  private listenToNewNotif() {
    this.sseService.currentNotif
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.table.tableService.setDataList();
      });
  }
  goToView(data: any) {
    this.router.navigateByUrl('/forwarded-mail/' + data?.data?.id);
  }
  showAddRequest(event: any) {
    const { data } = event;

    this.dialogUtilsService
      .openDialog(
        AddRequestComponent,
        this.localeService.translate('ADD_REQUEST'),
        {
          id: data?.id,
        },
        false,
        'w-7'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
    this.ref.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('MESSAGE_REQUEST_ADDED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
  showProcessingRequest(event: any) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        AddRequestComponent,
        this.localeService.translate('PROCESSING_REQUEST'),
        {
          idDemande: data?.idDemande,
        },
        false,
        'w-7'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
    this.ref.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('MESSAGE_REQUEST_ADDED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
}
