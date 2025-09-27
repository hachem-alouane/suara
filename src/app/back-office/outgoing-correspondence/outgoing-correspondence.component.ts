/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
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
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { LocaleService } from '../../data/services/config/local.service';
import { CourierService } from '../../data/services/courier.service';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { DispatchComponent } from '../archived-correspondence/dispatch/dispatch.component';

@Component({
  selector: 'app-outgoing-correspondence',
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
  templateUrl: './outgoing-correspondence.component.html',
  styleUrl: './outgoing-correspondence.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class OutgoingCorrespondenceComponent implements AfterViewInit {
  @ViewChild('table') table!: TableComponent;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);
  private readonly courierService = inject(CourierService);
  readonly userAuthService = inject(UserAuthService);
  readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);
  ref!: DynamicDialogRef;

  columns: ICols[] = [
    {
      header: 'MESSAGE_NUMBER',
      field: 'referenceCourrier',
      type: TableType.OUTGOING_CORRESPONDENCE,
    },

    {
      header: 'SENDER',
      field: 'expediteur',
      type: TableType.OUTGOING_CORRESPONDENCE,
      ltr: true,
    },
    {
      header: 'RECIPIENTS',
      field: 'destinataire',
      type: TableType.OUTGOING_CORRESPONDENCE,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'CORRESPONDENCE_DATE',
      field: 'dateReception',
      type: TableType.OUTGOING_CORRESPONDENCE,
      extras: ExtrasColumn.DATE,
    },
    {
      header: 'NOTES',
      field: 'priorite',
      type: TableType.OUTGOING_CORRESPONDENCE,
      extras: ExtrasColumn.BADGE,
    },
    {
      field: 'actions',
      header: 'Actions',
      type: TableType.OUTGOING_CORRESPONDENCE,
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

  ngAfterViewInit(): void {
    this.table.tableService.initTable(
      TableType.OUTGOING_CORRESPONDENCE,
      this.myForm
    );
  }

  goToView(data: any) {
    this.router.navigateByUrl('/courrier-entrant/' + data?.data?.id);
  }
}
