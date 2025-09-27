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
import { HistoryCourrierComponent } from './history-courrier/history-courrier.component';

@Component({
  selector: 'app-correspondence-follow-up',
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
  templateUrl: './correspondence-follow-up.component.html',
  styleUrl: './correspondence-follow-up.component.scss',
  providers: [DialogService, DialogUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorrespondenceFollowUpComponent implements OnInit, AfterViewInit {
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
      type: TableType.CORRESPONDENCE_FOLLOW_UP,
    },

    {
      header: 'SENDER',
      field: 'expediteur',
      type: TableType.CORRESPONDENCE_FOLLOW_UP,
      ltr: true,
    },
    {
      header: 'RECIPIENTS',
      field: 'destinataire',
      type: TableType.CORRESPONDENCE_FOLLOW_UP,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'CORRESPONDENCE_DATE',
      field: 'dateReception',
      type: TableType.CORRESPONDENCE_FOLLOW_UP,
      extras: ExtrasColumn.DATE,
    },

    {
      field: 'actions',
      header: 'Actions',
      type: TableType.CORRESPONDENCE_FOLLOW_UP,
    },
  ];
  private readonly fb = inject(NonNullableFormBuilder);
  myForm = this.fb.group({});
  ListOfUrgency: any[] = [];

  ngOnInit(): void {
    this.setUpListOfUrgency();
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
      TableType.CORRESPONDENCE_FOLLOW_UP,
      this.myForm
    );
  }
  showHistory(event: any) {
    const { data } = event;
    this.dialogUtilsService
      .openDialog(
        HistoryCourrierComponent,
        this.localeService.translate('CORRESPONDENCE_FOLLOW_UP'),
        {
          id: data?.id,
        },
        false,
        'w-7'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
  }
}
