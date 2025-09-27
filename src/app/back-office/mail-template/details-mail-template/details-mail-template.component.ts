/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { TemplateService } from '../../../data/services/template.service';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { Observable } from 'rxjs';
import { IDocument } from '../../../core/models/document.interface';
import { CardPieceJointeUploadComponent } from '../../../shared/components/card-piece-jointe-upload/card-piece-jointe-upload.component';
import { IPieceJointe } from '../../../core/models/piece-jointe.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { AsyncPipe } from '@angular/common';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';

@Component({
  selector: 'app-details-mail-template',
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonComponent,
    InputComponent,
    FocusInvalidInputDirective,
    FormsModule,
    ReactiveFormsModule,
    TextAreaComponent,
    TranslateModule,
    CardPieceJointeUploadComponent,
    NgxDocViewerModule,
    DropdownComponent,
    CardPieceJointeComponent,
    SvgIconComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './details-mail-template.component.html',
  styleUrl: './details-mail-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMailTemplateComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly templateService = inject(TemplateService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ref = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  selectedFiles: IPieceJointe[] = [];
  private readonly pieceJointeService = inject(PieceJointeService);
  documents$ = new Observable<IDocument[]>();

  myForm: UntypedFormGroup = this.fb.group({});
  id = this.dynamicDialogConfig?.data?.id ?? '';
  errorContentLanguage = false;

  ngOnInit(): void {
    this.listenToFormChanges();
  }
  ngAfterViewInit(): void {
    if (this.id) {
      this.loadModelByid(this.id);
      this.loadAllDocuments();
    }
  }
  readonly listOlanguage = [
    {
      name: 'Arabe',
      id: 'ar',
    },
    {
      name: 'Francais',
      id: 'fr',
    },
    {
      name: 'Englais',
      id: 'en',
    },
  ];

  private listenToFormChanges() {
    this.myForm?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_) => {
        this.errorContentLanguage = false;
      });
  }
  private loadModelByid(id: number) {
    this.templateService.getById(id).subscribe({
      next: (data) => {
        this.myForm.patchValue(data);
        this.cdr.markForCheck();
      },
      error: () => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  cancel() {
    this.ref.close();
  }
  save() {
    if (this.myForm.invalid) return;

    const formData = this.myForm.getRawValue();
    if (this.id) {
      this.updateTemplate(formData);
    } else {
      this.createTemplate(formData);
    }
  }
  annuler() {
    this.cancel();
  }
  private createTemplate(transformedData: any) {
    this.templateService.add(transformedData).subscribe({
      next: (data: any) => {
        if (this.selectedFiles?.length) {
          const filesOnly: File[] = this.selectedFiles.map(
            (piece) => piece.file!
          );
          this.pieceJointeService
            .uploadMultiplePieceJointeByIdModel(data?.id, filesOnly)
            .subscribe({
              next: (_) => {
                this.ref.close(true);
              },
              error: (_) => {
                this.dialogUtilsService.showErrorMessage();
                this.cdr.markForCheck();
              },
            });
        } else {
          this.ref.close(true);
        }
      },
      error: (err) => {
        if (
          err?.status === HttpStatusCode.BadRequest &&
          err?.error?.errorMessage === 'error.bad_request'
        ) {
          this.errorContentLanguage = true;
        } else {
          this.errorContentLanguage = false;
          this.dialogUtilsService.showErrorMessage();
        }
        this.cdr.markForCheck();
      },
    });
  }
  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getAlldocumentsByIdModel(this.id);
  }

  private updateTemplate(data: any) {
    this.templateService.update(this.id, data).subscribe({
      next: () => {
        if (this.selectedFiles?.length) {
          const filesOnly: File[] = this.selectedFiles.map(
            (piece) => piece.file!
          );
          this.pieceJointeService
            .uploadMultiplePieceJointeByIdModel(this?.id, filesOnly)
            .subscribe({
              next: (_) => {
                this.ref.close(true);
              },
              error: (_) => {
                this.dialogUtilsService.showErrorMessage();
                this.cdr.markForCheck();
              },
            });
        } else {
          this.ref.close(true);
        }
      },
      error: (err) => {
        if (
          err?.status === HttpStatusCode.BadRequest &&
          err?.error?.errorMessage === 'error.bad_request'
        ) {
          this.errorContentLanguage = true;
        } else {
          this.errorContentLanguage = false;
          this.dialogUtilsService.showErrorMessage();
        }
        this.cdr.markForCheck();
      },
    });
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
    this.ref?.close();
  }
}
