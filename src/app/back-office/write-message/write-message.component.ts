/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { FocusInvalidInputDirective } from '../../shared/directives/focus-first-invalid-input.directive';
import { InputComponent } from '../../shared/ui/input/input.component';
import { TextAreaComponent } from '../../shared/ui/textarea/textarea.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardPieceJointeUploadComponent } from '../../shared/components/card-piece-jointe-upload/card-piece-jointe-upload.component';
import { IPieceJointe } from '../../core/models/piece-jointe.interface';
import { DemandeService } from '../../data/services/demande.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { PieceJointeService } from '../../data/services/piece-jointe.service';
import { LocaleService } from '../../data/services/config/local.service';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-write-message',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    FocusInvalidInputDirective,
    InputComponent,
    TextAreaComponent,
    ButtonComponent,
    CardPieceJointeUploadComponent,
    DropdownComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './write-message.component.html',
  styleUrl: './write-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriteMessageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly demandeService = inject(DemandeService);
  private readonly pieceJointeService = inject(PieceJointeService);
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);
  myForm = this.fb.group<any>({});
  selectedFiles: IPieceJointe[] = [];
  private readonly dialogUtilsService = inject(DialogUtilsService);
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
  loading = false;
  ngOnInit(): void {
    this.listenToForm();
  }
  private listenToForm() {
    this.myForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {});
  }

  register() {
    if (this.myForm.invalid) return;
    this.loading = true;
    this.demandeService.addToBureauOrder(this.myForm.getRawValue()).subscribe({
      next: (data: any) => {
        if (this.selectedFiles?.length) {
          const filesOnly: File[] = this.selectedFiles.map(
            (piece) => piece.file!
          );

          this.pieceJointeService
            .uploadMultiplePieceJointeByIdDemande(data?.id, filesOnly)
            .subscribe({
              next: (_) => {
                this.dialogUtilsService.showSuccessMessage(
                  this.localeService.translate('MESSAGE_REQUEST_ADDED_SUCCESS')
                );
                this.loading = false;
                this.router.navigateByUrl('/registry-request');
              },

              error: (_) => {
                this.loading = false;
                this.dialogUtilsService.showErrorMessage();
              },
            });
        } else {
          this.dialogUtilsService.showSuccessMessage(
            this.localeService.translate('MESSAGE_REQUEST_ADDED_SUCCESS')
          );
          this.loading = false;

          this.router.navigateByUrl('/registry-request');
        }
        this.cdr.markForCheck();
      },
      error: (_) => {
        this.loading = false;
        this.cdr.markForCheck();
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  reset() {
    this.myForm.get('objet')?.patchValue('');
    this.myForm.get('description')?.patchValue('');
    this.selectedFiles = [];
    this.myForm.get('priorite')?.patchValue('');
    this.cdr.markForCheck();
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
}
