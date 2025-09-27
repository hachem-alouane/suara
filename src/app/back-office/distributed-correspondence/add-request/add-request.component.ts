/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { IPieceJointe } from '../../../core/models/piece-jointe.interface';
import { LocaleService } from '../../../data/services/config/local.service';
import { CourierService } from '../../../data/services/courier.service';
import { DemandeService } from '../../../data/services/demande.service';
import { EmployerService } from '../../../data/services/employe.service';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { CardPieceJointeUploadComponent } from '../../../shared/components/card-piece-jointe-upload/card-piece-jointe-upload.component';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { DynamicDatePipe } from '../../../shared/pipes/dynamic-date.pipe';
import { NewlineToBrPipe } from '../../../shared/pipes/new-line.pipe';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { ICourrierHistorique } from '../../../core/models/historique-demande.interface';
import { FieldsetModule } from 'primeng/fieldset';
import { AsyncPipe } from '@angular/common';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';
import { finalize, Observable } from 'rxjs';
import { IDocument } from '../../../core/models/document.interface';

@Component({
  selector: 'app-add-request',
  standalone: true,
  imports: [
    ButtonComponent,
    TranslateModule,
    DropdownComponent,
    TextAreaComponent,
    FocusInvalidInputDirective,
    ReactiveFormsModule,
    FormsModule,
    CardPieceJointeUploadComponent,
    SvgIconComponent,
    InputComponent,
    DynamicDatePipe,
    NewlineToBrPipe,
    FieldsetModule,
    AsyncPipe,
    CardPieceJointeComponent,
  ],
  providers: [DialogService, DialogUtilsService],

  templateUrl: './add-request.component.html',
  styleUrl: './add-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRequestComponent implements OnDestroy, OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly employerService = inject(EmployerService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly demandeService = inject(DemandeService);
  private readonly courierService = inject(CourierService);
  private readonly localeService = inject(LocaleService);
  private readonly pieceJointeService = inject(PieceJointeService);
  private readonly cdr = inject(ChangeDetectorRef);
  documents$ = new Observable<IDocument[]>();

  selectedFiles: IPieceJointe[] = [];
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
  myForm = this.fb.group<any>({});
  private readonly ref = inject(DynamicDialogRef);
  idCourrier = this.dynamicDialogConfig?.data?.id;
  processingRequest = !!this.dynamicDialogConfig?.data?.idDemande;
  requestDetailsMode = !!this.dynamicDialogConfig?.data?.requestDetailsMode;
  requestSortedMail = !!this.dynamicDialogConfig?.data?.requestSortedMail;
  modeRegistryRequest = !!this.dynamicDialogConfig?.data?.modeRegistryRequest;
  demande: ICourrierHistorique | null = null;
  loading = false;

  ngOnInit(): void {
    if (this.processingRequest) {
      this.loadHistoryByIdDemande();
      this.loadAllDocuments();
    }
  }
  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getAlldocumentsByIdDemande(
      this.dynamicDialogConfig.data?.idDemande
    );
  }
  private loadHistoryByIdDemande() {
    this.courierService
      .getHistoriqueByIdDemande(this.dynamicDialogConfig.data?.idDemande)
      .subscribe((data) => {
        this.demande = data;
        this.cdr.markForCheck();
      });
  }
  cancel(modeConsult = false) {
    this.ref.close(modeConsult ? true : null);
  }
  addRequest() {
    if (this.myForm.invalid) return;
    this.loading = true;
    if (this.processingRequest) {
      this.demandeService
        .addTraitementDemande(
          this.dynamicDialogConfig.data?.idDemande,
          this.myForm.getRawValue()
        )
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (data: any) => {
            if (this.selectedFiles?.length) {
              const filesOnly: File[] = this.selectedFiles.map(
                (piece) => piece.file!
              );
              this.pieceJointeService
                .uploadMultiplePieceJointeByIdDemande(data?.id, filesOnly)
                .subscribe({
                  next: (_) => {
                    this.ref.close(true);
                  },
                  error: (_) => {
                    this.dialogUtilsService.showErrorMessage();
                  },
                });
            } else {
              this.ref.close(true);
            }
          },
          error: (_) => {
            this.dialogUtilsService.showErrorMessage();
          },
        });
    } else if (this.modeRegistryRequest) {
      this.demandeService
        .traitementDemande(this.idCourrier, this.myForm.getRawValue())
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (data: any) => {
            if (this.selectedFiles?.length) {
              const filesOnly: File[] = this.selectedFiles.map(
                (piece) => piece.file!
              );
              this.pieceJointeService
                .uploadMultiplePieceJointeByIdDemande(data?.id, filesOnly)
                .subscribe({
                  next: (_) => {
                    this.ref.close(true);
                  },
                  error: (_) => {
                    this.dialogUtilsService.showErrorMessage();
                  },
                });
            } else {
              this.ref.close(true);
            }
          },
          error: (_) => {
            this.dialogUtilsService.showErrorMessage();
          },
        });
    } else {
      this.demandeService
        .addToCourrier(this.idCourrier, this.myForm.getRawValue())
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (data: any) => {
            if (this.selectedFiles?.length) {
              const filesOnly: File[] = this.selectedFiles.map(
                (piece) => piece.file!
              );
              this.pieceJointeService
                .uploadMultiplePieceJointeByIdDemande(data?.id, filesOnly)
                .subscribe({
                  next: (_) => {
                    this.ref.close(true);
                  },
                  error: (_) => {
                    this.dialogUtilsService.showErrorMessage();
                  },
                });
            } else {
              this.ref.close(true);
            }
          },
          error: (_) => {
            this.dialogUtilsService.showErrorMessage();
          },
        });
    }
  }
  onFileSelected(event: any): void {
    const files = event?.target?.files;
    Array.from(files)?.forEach((file: any) => {
      const fileName = file?.name;
      this.selectedFiles.push({
        fileName: fileName,
        file: file,
      });
    });
  }
  deleteFile(data: any) {
    this.selectedFiles.splice(data?.index, 1);
  }
  previewFile(data: { file: File }) {
    const { file } = data;
    if (file.type.startsWith('text/csv')) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const rows = text
          .trim()
          .split('\n')
          .map((row) => row.split(','));

        const htmlTable = `
          <html>
            <head><title>CSV Preview</title>
            <style>body{font-family:sans-serif;padding:1rem;}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f9f9f9}tr:nth-child(even){background:#f2f2f2}</style>
            </head>
            <body>
            <table>
              ${rows
                .map(
                  (row, i) =>
                    `<tr>${row
                      .map((cell) =>
                        i === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`
                      )
                      .join('')}</tr>`
                )
                .join('')}
            </table>
            </body>
          </html>`;
        const newWindow = window.open('', '_blank');
        newWindow?.document.write(htmlTable);
        newWindow?.document.close();
      };
      reader.readAsText(file);
    } else {
      const blobUrl = URL.createObjectURL(file);
      const newTab = window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    }
  }
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close(this.requestDetailsMode ? true : null);
    }
  }
}
