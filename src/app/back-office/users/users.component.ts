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
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { ICols } from '../../core/models/table/cols.interface';
import { TableType } from '../../core/models/table/table-type.enum';
import { LocaleService } from '../../data/services/config/local.service';
import { EmployerService } from '../../data/services/employe.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TableComponent } from '../../shared/ui/table/table.component';
import { DetailsUsersComponent } from './details-users/details-users.component';
import { ConfirmationService } from 'primeng/api';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { PermissionComponent } from './permission/permission.component';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';
import { Role } from '../../core/enums/role.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SvgIconComponent,
    InputComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    TableComponent,
    DropdownComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [DialogService, DialogUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements AfterViewInit, OnInit {
  @ViewChild('table') table!: TableComponent;
  private readonly employerService = inject(EmployerService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly userAuthService = inject(UserAuthService);
  private readonly localeService = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  myForm = this.fb.group({});
  ref!: DynamicDialogRef;
  listOfStatus = [
    {
      id: 1,
      name: this.localeService.translate('ACTIVEE'),
      value: false,
    },
    {
      id: 2,
      name: this.localeService.translate('BLOCKEDD'),
      value: true,
    },
  ];
  columns: ICols[] = [
    {
      header: 'NAME',
      field: 'firstName',
      type: TableType.USERS,
    },
    {
      header: 'SURNAME',
      field: 'lastName',
      type: TableType.USERS,
    },
    {
      header: 'ADDRESS',
      field: 'lieu',
      type: TableType.USERS,
    },
    {
      header: 'EMAIL',
      field: 'email',
      type: TableType.USERS,
    },
    {
      header: 'PHONE',
      field: 'numeroTelephone',
      type: TableType.USERS,
    },
    {
      header: 'STATUS',
      field: 'activated',
      extras: ExtrasColumn.BADGE,
      type: TableType.USERS,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.USERS,
    },
  ];

  actionsTable: ActionMenuType[] = [];
  canCreateMode = false;
  ngOnInit(): void {
    this.listenToCurrentUser();
  }
  ngAfterViewInit(): void {
    this.table.tableService.initTable(TableType.USERS, this.myForm);
  }
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canCreate = hasModulePermission('USER', 'CREATE');
        this.canCreateMode = canCreate(user?.modules ?? []);
        const canBlock = hasModulePermission('USER', 'BLOCK');
        const canUnblock = hasModulePermission('USER', 'UNBLOCK');
        const canUpdate = hasModulePermission('USER', 'UPDATE');

        if (canUpdate(user?.modules ?? [])) this.actionsTable.push('edit');
        if (canBlock(user?.modules ?? [])) this.actionsTable.push('block');
        if (canUnblock(user?.modules ?? [])) this.actionsTable.push('enable');
        if (user?.role?.name === Role.SUPERADMIN) {
          this.actionsTable.push('permission');
        }
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showEditPoppup(event: { data: any }) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        DetailsUsersComponent,
        this.localeService.translate('UPDATE_USER'),
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
          this.localeService.translate('USER_UPDATED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
  showAddPoppup() {
    this.dialogUtilsService
      .openDialog(
        DetailsUsersComponent,
        this.localeService.translate('ADD_USER'),
        {},
        false,
        'w-7'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
    this.ref.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('USER_ADDED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blockUser(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_BLOCK_USER'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass: 'p-button  p-button-danger ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.blockUserById(data?.data?.id);
      },
    });
  }
  private blockUserById(id: number) {
    this.userAuthService.blockUserById(id, true).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('BLOCK_SUCCESS')
        );

        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  enableUser(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_ACTIVATE_USER'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass:
        'p-button  p-button-success ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.enableUserById(data?.data?.id);
      },
    });
  }
  private enableUserById(id: number) {
    this.userAuthService.blockUserById(id, false).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('ACTIVATE_SUCCESS')
        );
        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  showPermissionPoppup(event: any) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        PermissionComponent,
        this.localeService.translate('PERMISSION_INTERFACE_TITLE'),
        {
          id: data?.id,
          role: data?.role?.name,
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
          this.localeService.translate('PERMISSION_UPDATED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
}
