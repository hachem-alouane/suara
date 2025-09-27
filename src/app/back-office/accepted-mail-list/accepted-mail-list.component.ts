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
import {
  ReactiveFormsModule,
  FormsModule,
  NonNullableFormBuilder,
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
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TableComponent } from '../../shared/ui/table/table.component';
import { ArchiveConfirmComponent } from '../incoming-correspondence/archive-confirm/archive-confirm.component';
import { DetailsDemandeComponent } from '../incoming-correspondence/details-demande/details-demande.component';
import { AddRequestComponent } from '../distributed-correspondence/add-request/add-request.component';
import { SendMailComponent } from './send-mail/send-mail.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SseService } from '../../data/services/sse.service';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';

@Component({
  selector: 'app-accepted-mail-list',
  standalone: true,
  imports: [
    TableComponent,
    TranslateModule,
    SvgIconComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    DatePickerComponent,
  ],
  templateUrl: './accepted-mail-list.component.html',
  styleUrl: './accepted-mail-list.component.scss',
  providers: [DialogService, DialogUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptedMailListComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table!: TableComponent;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly courierService = inject(CourierService);
  readonly userAuthService = inject(UserAuthService);
  readonly sseService = inject(SseService);
  readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);
  ref!: DynamicDialogRef;

  columns: ICols[] = [
    {
      header: 'REQUEST_NUMBER',
      field: 'referenceDemande',
      type: TableType.ACCEPTED_MAIL_LIST,
    },

    {
      header: 'SENDER',
      field: 'creePar',
      type: TableType.ACCEPTED_MAIL_LIST,
      ltr: true,
    },

    {
      header: 'CORRESPONDENCE_DATE',
      field: 'dateCreation',
      type: TableType.ACCEPTED_MAIL_LIST,
      extras: ExtrasColumn.DATE,
    },
    {
      header: 'NOTES',
      field: 'priorite',
      type: TableType.ACCEPTED_MAIL_LIST,
      extras: ExtrasColumn.BADGE,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.ACCEPTED_MAIL_LIST,
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
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canView = hasModulePermission('ACCEPTED_MAIL_LIST', 'VIEW');
        const canSend = hasModulePermission('ACCEPTED_MAIL_LIST', 'SEND');

        if (canView(user?.modules ?? [])) this.actionsTable.push('view');
        if (canSend(user?.modules ?? [])) this.actionsTable.push('send-email');
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

  ngAfterViewInit(): void {
    this.table.tableService.initTable(
      TableType.ACCEPTED_MAIL_LIST,
      this.myForm
    );
    this.listenToNewNotif();
  }
  private listenToNewNotif() {
    this.sseService.currentNotif
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.table.tableService.setDataList();
      });
  }
  goToView(event: any) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        AddRequestComponent,
        this.localeService.translate('REQUEST_DETAILS'),
        {
          idDemande: data?.id,
          requestDetailsMode: true,
        },
        false,
        'w-7'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
    this.ref.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.table.tableService.setDataList();
      }
    });
  }
  showDemande(event: any) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        SendMailComponent,
        this.localeService.translate('SEND_EMAILL'),
        {
          idDemande: data?.id,
          requestSortedMail: data?.typeDemande === 'SORTANT' ? true : false,
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
          this.localeService.translate('EMAIL_SENT_SUCCESSFULLY')
        );
        this.table.tableService.setDataList();
      }
    });
  }
}
