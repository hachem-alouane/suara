/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TableComponent } from '../../shared/ui/table/table.component';
import { ArchiveConfirmComponent } from './archive-confirm/archive-confirm.component';
import { DetailsDemandeComponent } from './details-demande/details-demande.component';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';
import { Role } from '../../core/enums/role.enum';

@Component({
  selector: 'app-incoming-correspondence',
  standalone: true,
  imports: [
    TableComponent,
    TranslateModule,
    SvgIconComponent,
    DropdownComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    DatePickerComponent,
  ],
  templateUrl: './incoming-correspondence.component.html',
  styleUrl: './incoming-correspondence.component.scss',
  providers: [DialogService, DialogUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomingCorrespondenceComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table!: TableComponent;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly courierService = inject(CourierService);
  private readonly sseService = inject(SseService);
  readonly userAuthService = inject(UserAuthService);
  readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);
  ref!: DynamicDialogRef;

  columns: ICols[] = [
    {
      header: 'MESSAGE_NUMBER',
      field: 'referenceCourrier',
      type: TableType.INCOMING_CORRESPONDENCE,
    },

    {
      header: 'SENDER',
      field: 'expediteur',
      type: TableType.INCOMING_CORRESPONDENCE,
      ltr: true,
    },
    {
      header: 'RECIPIENTS',
      field: 'destinataire',
      type: TableType.INCOMING_CORRESPONDENCE,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'CORRESPONDENCE_DATE',
      field: 'dateReception',
      type: TableType.INCOMING_CORRESPONDENCE,
      extras: ExtrasColumn.DATE,
    },

    {
      field: 'actions',
      header: 'Actions',
      type: TableType.INCOMING_CORRESPONDENCE,
    },
  ];
  private readonly fb = inject(NonNullableFormBuilder);
  myForm = this.fb.group({});
  ListOfUrgency: any[] = [];
  actionsTable: ActionMenuType[] = [];

  ngOnInit(): void {
    this.setUpListOfUrgency();
    this.listenToCurrentUser();
  }
  ngAfterViewInit(): void {
    this.table.tableService.initTable(
      TableType.INCOMING_CORRESPONDENCE,
      this.myForm
    );
    this.listenToNewNotif();
  }
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canView = hasModulePermission('INCOMING_CORRESPONDENCE', 'VIEW');
        const canTransfer = hasModulePermission(
          'INCOMING_CORRESPONDENCE',
          'ARCHIVE'
        );
        const canDelete = hasModulePermission(
          'INCOMING_CORRESPONDENCE',
          'DELETE'
        );

        if (canView(user?.modules ?? [])) this.actionsTable.push('view');
        if (canTransfer(user?.modules ?? []))
          this.actionsTable.push('transfer');
        if (canDelete(user?.modules ?? [])) this.actionsTable.push('delete');
        if (
          user?.role?.name === Role.SUPERADMIN ||
          user?.role?.name === Role.ADMIN
        ) {
          this.actionsTable.push('decision');
        }
      });
  }
  private setUpListOfUrgency() {
    this.ListOfUrgency = [
      {
        name: this.localeService.translate('URGENT'),
        value: 'urgent',
      },
      {
        name: this.localeService.translate('VERY_URGENT'),
        value: 'very urgent',
      },
    ];
  }
  private listenToNewNotif() {
    this.sseService.currentNotif
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.table.tableService.setDataList();
      });
  }

  showTransfert(data: any) {
    this.dialogUtilsService
      .openDialog(
        ArchiveConfirmComponent,
        this.localeService.translate('CONFIRM_ARCHIVE_MAIL'),
        {
          id: data?.data?.id,
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
          this.localeService.translate('MAIL_ARCHIVED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
  showDelete(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_DELETE_MAIL'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass:
        'p-button  .p-button-sm btn-action-dialogue-cus  p-button-danger ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  .p-button-sm btn-action-dialogue-cus  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.rejectCourier(data?.data?.id);
      },
    });
  }
  goToView(data: any) {
    // this.courierService.seen(data?.data?.id).subscribe({
    //   next: () => {
    //   },
    // });
    this.router.navigateByUrl('/courrier-entrant/' + data?.data?.id);
  }

  private rejectCourier(id: number) {
    this.courierService.rejectCourrierById(id).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('DELETE_SUCCESS')
        );

        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  showDetailsMail(event: { data: any }) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        DetailsDemandeComponent,
        this.localeService.translate('REQUEST_DETAILS'),

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
      if (result?.type == 'accept') {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('REQUEST_ACCEPTED_SUCCESSFULLY')
        );
      } else if (result?.type == 'refus') {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('REQUEST_CANCELED_SUCCESS')
        );
      } else if (result?.type == 'ci ') {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('REQUEST_PROCESSED_SUCCESS')
        );
      }
      this.table.tableService.setDataList();
    });
  }
}
