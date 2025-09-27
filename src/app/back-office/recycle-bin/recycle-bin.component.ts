import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { InputComponent } from '../../shared/ui/input/input.component';
import { TableComponent } from '../../shared/ui/table/table.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { ConfirmationService } from 'primeng/api';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { LocaleService } from '../../data/services/config/local.service';
import { CourierService } from '../../data/services/courier.service';
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';

@Component({
  selector: 'app-recycle-bin',
  standalone: true,
  imports: [
    TableComponent,
    SvgIconComponent,
    TranslateModule,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
  ],
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class RecycleBinComponent implements AfterViewInit {
  @ViewChild('table') table!: TableComponent;
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly courierService = inject(CourierService);

  ref!: DynamicDialogRef;

  myForm = this.fb.group({});

  columns: ICols[] = [
    {
      header: 'MESSAGE_NUMBER',
      field: 'referenceCourrier',
      type: TableType.RECYCLE_BIN,
    },

    {
      header: 'SENDER',
      field: 'expediteur',
      type: TableType.RECYCLE_BIN,
      ltr: true,
    },
    {
      header: 'RECIPIENTS',
      field: 'destinataire',
      type: TableType.RECYCLE_BIN,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'CORRESPONDENCE_DATE',
      field: 'dateReception',
      type: TableType.RECYCLE_BIN,
      extras: ExtrasColumn.DATE,
    },

    {
      field: 'actions',
      header: 'Actions',
      type: TableType.RECYCLE_BIN,
    },
  ];
  ngAfterViewInit(): void {
    this.table.tableService.initTable(TableType.RECYCLE_BIN, this.myForm);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RestoreAction(data: any) {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_RESTORE_MAIL'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass:
        'p-button  p-button-success ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.Restore(data?.data?.id);
      },
    });
  }

  private Restore(id: number) {
    this.courierService.changeStatusFromRejecteToEnAttente(id).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('MAIL_RESTORED_SUCCESS')
        );
        this.table.tableService.setDataList();
      },
      error: (_) => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
}
