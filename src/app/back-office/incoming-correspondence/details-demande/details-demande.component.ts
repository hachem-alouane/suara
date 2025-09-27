/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { finalize, Observable } from 'rxjs';
import { IDocument } from '../../../core/models/document.interface';
import { LocaleService } from '../../../data/services/config/local.service';
import { CourierService } from '../../../data/services/courier.service';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { DynamicDatePipe } from '../../../shared/pipes/dynamic-date.pipe';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { NewlineToBrPipe } from '../../../shared/pipes/new-line.pipe';
import { DemandeService } from '../../../data/services/demande.service';
import { ICourrierHistorique } from '../../../core/models/historique-demande.interface';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-details-demande',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    FocusInvalidInputDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DynamicDatePipe,
    DropdownComponent,
    NgxDocViewerModule,
    TextAreaComponent,
    AsyncPipe,
    CardPieceJointeComponent,
    PriorityPipe,
    NewlineToBrPipe,
    JsonPipe,
    FieldsetModule,
  ],
  templateUrl: './details-demande.component.html',
  styleUrl: './details-demande.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class DetailsDemandeComponent implements OnInit, OnDestroy {
  ref2!: DynamicDialogRef;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly courierService = inject(CourierService);
  private readonly demandeService = inject(DemandeService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);
  private readonly pieceJointeService = inject(PieceJointeService);

  readonly ListOfDecisions = [
    {
      name: this.localeService.translate('ADDITIONAL_INFORMATION'),
      value: 'CI',
    },
    {
      name: this.localeService.translate('YES'),
      value: 'OUI',
    },
    {
      name: this.localeService.translate('NO'),
      value: 'non',
    },
  ];
  previewUrl = '';
  fileType = '';
  myForm: UntypedFormGroup = this.fb.group({});
  private readonly ref = inject(DynamicDialogRef);
  documents$ = new Observable<IDocument[]>();
  demande: ICourrierHistorique | null = null;
  loading = false;
  ngOnInit(): void {
    this.loadDemandeDetails();
    this.loadAllDocuments();
  }
  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getAlldocumentsByIdDemande(
      this.dynamicDialogConfig.data?.idDemande
    );
  }
  private loadDemandeDetails() {
    this.courierService
      .getHistoriqueByIdDemande(this.dynamicDialogConfig.data?.idDemande)
      .subscribe((data) => {
        this.demande = data;
        this.cdr.markForCheck();
      });
  }
  register() {
    if (this.myForm?.invalid) return;
    this.loading = true;
    switch (this.myForm?.get('decsionformcontrol')?.value) {
      case 'OUI':
        this.demandeService
          .acceptDemande(this.dynamicDialogConfig.data?.idDemande)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.ref.close({ type: 'accept' });
            },
            error: () => {
              this.dialogUtilsService.showErrorMessage();
            },
          });
        break;
      case 'non':
        this.demandeService
          .refuserDemande(this.dynamicDialogConfig.data?.idDemande)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.ref.close({ type: 'refus' });
            },
            error: () => {
              this.dialogUtilsService.showErrorMessage();
            },
          });
        break;
      case 'CI':
        this.demandeService
          .ciDemande(
            this.dynamicDialogConfig.data?.idDemande,
            this.myForm?.get('description')?.value
          )
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.ref.close({ type: 'refus' });
            },
            error: () => {
              this.dialogUtilsService.showErrorMessage();
            },
          });
        break;
      default:
        break;
    }
  }

  cancel() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
