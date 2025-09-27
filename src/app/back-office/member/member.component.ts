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
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { LocaleService } from '../../data/services/config/local.service';
import { MemberService } from '../../data/services/member.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TableComponent } from '../../shared/ui/table/table.component';
import { DetailsMemberComponent } from './details-member/details-member.component';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    TableComponent,
    SvgIconComponent,
    TranslateModule,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    DropdownComponent,
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss',
  providers: [DialogService, DialogUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberComponent implements AfterViewInit, OnInit {
  @ViewChild('table') table!: TableComponent;
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly memberService = inject(MemberService);
  private readonly userAuthService = inject(UserAuthService);
  private readonly destroyRef = inject(DestroyRef);

  ref!: DynamicDialogRef;

  myForm = this.fb.group({});
  listOfStatus = [
    {
      id: 1,
      name: this.localeService.translate('ACTIVE'),
      value: 'ENABLED',
    },
    {
      id: 2,
      name: this.localeService.translate('INACTIVE'),
      value: 'DISABLED',
    },
  ];
  columns: ICols[] = [
    {
      header: 'NAME',
      field: 'nom',
      type: TableType.MEMBER,
    },
    {
      header: 'ADDRESS',
      field: 'adresse',
      type: TableType.MEMBER,
    },
    {
      header: 'EMAIL',
      field: 'email',
      type: TableType.MEMBER,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'PHONE',
      field: 'numTel',
      type: TableType.MEMBER,
    },
    {
      header: 'STATUS',
      field: 'statut',
      type: TableType.MEMBER,
      extras: ExtrasColumn.BADGE,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.MEMBER,
    },
  ];
  actionsTable: ActionMenuType[] = [];
  canCreateMode = false;
  ngOnInit(): void {
    this.listenToCurrentUser();
  }
  ngAfterViewInit(): void {
    this.table.tableService.initTable(TableType.MEMBER, this.myForm);
  }
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canCreate = hasModulePermission('MEMBER', 'CREATE');
        this.canCreateMode = canCreate(user?.modules ?? []);
        const canBlock = hasModulePermission('MEMBER', 'DISABLE');
        const canUnblock = hasModulePermission('MEMBER', 'ENABLE');
        const canUpdate = hasModulePermission('MEMBER', 'UPDATE');
        if (canUpdate(user?.modules ?? [])) this.actionsTable.push('edit');
        if (canBlock(user?.modules ?? [])) this.actionsTable.push('deactivate');
        if (canUnblock(user?.modules ?? [])) this.actionsTable.push('enable');
      });
  }
  showAddPoppup() {
    this.dialogUtilsService
      .openDialog(
        DetailsMemberComponent,
        this.localeService.translate('ADD_MEMBER'),
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
          this.localeService.translate('MEMBER_ADDED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
  enableAction(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_ACTIVATE_MEMBER'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass:
        'p-button  p-button-success ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.enable(data?.data?.id);
      },
    });
  }
  deactivateAction(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_DEACTIVATE_MEMBER'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass: 'p-button  p-button-danger ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.deactivate(data?.data?.id);
      },
    });
  }
  private enable(id: number) {
    this.memberService.enableMember(id).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('ENABLED_SUCCESS_MEMBER')
        );
        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  private deactivate(id: number) {
    this.memberService.disableMember(id).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('DEACTIVATED_SUCCESS_MEMBER')
        );
        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  showEditPoppup(event: { data: any }) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        DetailsMemberComponent,
        this.localeService.translate('UPDATE_MEMBER'),
        {
          id: data?.id,
          modeEdit: 'true',
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
          this.localeService.translate('MEMBER_UPDATED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
}
