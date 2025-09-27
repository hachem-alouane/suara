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
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { TableComponent } from '../../shared/ui/table/table.component';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { LocaleService } from '../../data/services/config/local.service';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TemplateService } from '../../data/services/template.service';
import { DetailsMailTemplateComponent } from './details-mail-template/details-mail-template.component';
import { ActionMenuType } from '../../core/models/table/actions-menu.enum';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { hasModulePermission } from '../../shared/utils/has-module-and-apermission.util';

@Component({
  selector: 'app-mail-template',
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
  templateUrl: './mail-template.component.html',
  styleUrl: './mail-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class MailTemplateComponent implements AfterViewInit, OnInit {
  @ViewChild('table') table!: TableComponent;
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userAuthService = inject(UserAuthService);
  ref!: DynamicDialogRef;

  myForm = this.fb.group({});
  listOfStatus = [
    {
      id: 1,
      name: this.localeService.translate('ACTIVE'),
      value: 'ACTIVE',
    },
    {
      id: 2,
      name: this.localeService.translate('INACTIVE'),
      value: 'DISABLED',
    },
  ];
  columns: ICols[] = [
    {
      header: 'SUBJECT',
      field: 'sujet',
      type: TableType.MAIL_TEMPLATE,
    },
    {
      header: 'CREE_PAR',
      field: 'creePar',
      type: TableType.MAIL_TEMPLATE,
    },
    {
      header: 'CREATION_DATE',
      field: 'dateCreation',
      type: TableType.MAIL_TEMPLATE,
      extras: ExtrasColumn.DATE,
    },
    {
      header: 'STATUS',
      field: 'statut',
      type: TableType.MAIL_TEMPLATE,
      extras: ExtrasColumn.BADGE,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.MAIL_TEMPLATE,
    },
  ];
  actionsTable: ActionMenuType[] = [];
  canCreateMode = false;
  ngOnInit(): void {
    this.listenToCurrentUser();
  }
  ngAfterViewInit(): void {
    this.table.tableService.initTable(TableType.MAIL_TEMPLATE, this.myForm);
  }
  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        const canCreate = hasModulePermission('MODEL', 'CREATE');
        this.canCreateMode = canCreate(user?.modules ?? []);
        const canBlock = hasModulePermission('MODEL', 'DISABLE');
        const canUnblock = hasModulePermission('MODEL', 'ENABLE');
        const canUpdate = hasModulePermission('MODEL', 'UPDATE');

        if (canUpdate(user?.modules ?? [])) this.actionsTable.push('edit');
        if (canBlock(user?.modules ?? [])) this.actionsTable.push('deactivate');
        if (canUnblock(user?.modules ?? [])) this.actionsTable.push('enable');
      });
  }
  showAddPoppup() {
    this.dialogUtilsService
      .openDialog(
        DetailsMailTemplateComponent,
        this.localeService.translate('ADD_TEMPLATE'),
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
          this.localeService.translate('TEMPLATE_ADDED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
  enableAction(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_ACTIVATE_TEMPLATE'),
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
      header: this.localeService.translate('CONFIRM_DEACTIVATE_TEMPLATE'),
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
    this.templateService.enableModele(id).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('ENABLED_SUCCESS_TEMPLATE')
        );
        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  private deactivate(id: number) {
    this.templateService.disableModele(id).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('DEACTIVATED_SUCCESS_TEMPLATE')
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
        DetailsMailTemplateComponent,
        this.localeService.translate('UPDATE_TEMPLATE'),
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
          this.localeService.translate('TEMPLATE_UPDATED_SUCCESS')
        );
        this.table.tableService.setDataList();
      }
    });
  }
}
