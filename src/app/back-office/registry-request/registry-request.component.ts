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
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { TableComponent } from '../../shared/ui/table/table.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { LocaleService } from '../../data/services/config/local.service';
import { CourierService } from '../../data/services/courier.service';
import { DispatchComponent } from '../archived-correspondence/dispatch/dispatch.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Role } from '../../core/enums/role.enum';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { AddRequestComponent } from '../distributed-correspondence/add-request/add-request.component';
import { DecisionRegistryRequestComponent } from './decision-registry-request/decision-registry-request.component';
import { SseService } from '../../data/services/sse.service';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';

@Component({
  selector: 'app-registry-request',
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
  providers: [DialogService, DialogUtilsService],

  templateUrl: './registry-request.component.html',
  styleUrl: './registry-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryRequestComponent implements AfterViewInit, OnInit {
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
      header: 'REQUEST_NUMBER',
      field: 'referenceDemande',
      type: TableType.REGISTRY_REQUEST,
    },
    {
      header: 'REQUEST_SUBJECT',
      field: 'objet',
      type: TableType.REGISTRY_REQUEST,
    },
    {
      header: 'REQUEST_OWNER',
      field: 'creePar',
      type: TableType.REGISTRY_REQUEST,
      ltr: true,
    },
    {
      header: 'REQUEST_DATE',
      field: 'dateCreation',
      type: TableType.REGISTRY_REQUEST,
      extras: ExtrasColumn.DATE,
    },
    {
      header: 'STATUS',
      field: 'statutDemande',
      type: TableType.REGISTRY_REQUEST,
      extras: ExtrasColumn.BADGE,
    },

    {
      header: 'NOTES',
      field: 'priorite',
      type: TableType.REGISTRY_REQUEST,
      extras: ExtrasColumn.BADGE,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.REGISTRY_REQUEST,
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
  ngOnInit(): void {
    this.listenToCurrentUser();
  }
  ngAfterViewInit(): void {
    this.table.tableService.initTable(TableType.REGISTRY_REQUEST, this.myForm);
    this.listenToNewNotif();
  }
  private listenToNewNotif() {
    this.sseService.currentNotif
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.table.tableService.setDataList();
      });
  }
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canView = hasModulePermission('REGISTRY_OFFICE_REQUESTS', 'VIEW');
        const canDecision = hasModulePermission(
          'REGISTRY_OFFICE_REQUESTS',
          'DECISION'
        );
        const canRequest = hasModulePermission(
          'REGISTRY_OFFICE_REQUESTS',
          'REQUEST'
        );
        if (canView(user?.modules ?? [])) this.actionsTable.push('view');
        if (
          canDecision(user?.modules ?? []) &&
          (user?.role?.name === Role.SUPERADMIN ||
            user?.role?.name === Role.ADMIN)
        ) {
          this.actionsTable.push('decision');
        }
        if (
          canRequest(user?.modules ?? []) &&
          user?.role?.name === Role.EMPLOYER
        ) {
          this.actionsTable.push('processing-request');
        }
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDetailsMail(event: { data: any }) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        DecisionRegistryRequestComponent,
        this.localeService.translate('DECISION'),

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processingRequest(event: any) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        AddRequestComponent,
        this.localeService.translate('PROCESSING_REQUEST'),
        {
          id: data?.id,
          modeRegistryRequest: true,
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
