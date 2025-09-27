/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { EmployerService } from '../../../data/services/employe.service';
import { finalize, Observable } from 'rxjs';
import { IEmploye } from '../../../core/models/member.interface';
import { AsyncPipe } from '@angular/common';
import { CourierService } from '../../../data/services/courier.service';
import { TokenService } from '../../../data/services/auth/token.service';
import { IPieceJointe } from '../../../core/models/piece-jointe.interface';
import { CardPieceJointeUploadComponent } from '../../../shared/components/card-piece-jointe-upload/card-piece-jointe-upload.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { IDocument } from '../../../core/models/document.interface';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';
import { IUser } from '../../../core/models/user.interface';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [
    ButtonComponent,
    TranslateModule,
    DropdownComponent,
    TextAreaComponent,
    FocusInvalidInputDirective,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    CardPieceJointeUploadComponent,
    SvgIconComponent,
    CardPieceJointeComponent,
  ],
  providers: [DialogService, DialogUtilsService],

  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispatchComponent implements OnDestroy, OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly employerService = inject(EmployerService);
  private readonly courierService = inject(CourierService);
  private readonly tokenService = inject(TokenService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly pieceJointeService = inject(PieceJointeService);

  selectedFiles: IPieceJointe[] = [];
  documents$ = new Observable<IDocument[]>();

  myForm = this.fb.group<any>({});
  private readonly ref = inject(DynamicDialogRef);
  employes$ = new Observable<IUser>();
  loading = false;
  ngOnInit(): void {
    this.loadAllDocuments();
    this.loadAllEmployer();
  }
  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getAlldocumentsById(
      this.dynamicDialogConfig.data?.id
    );
  }
  private loadAllEmployer() {
    this.employes$ = this.employerService.getAll();
  }
  cancel() {
    this.ref.close();
  }
  dispatch() {
    if (this.myForm.invalid) return;
    this.loading = true;
    const filesOnly: File[] = this.selectedFiles.map((piece) => piece.file!);
    this.courierService
      .forwardEmaile(
        this.dynamicDialogConfig?.data?.id,
        this.myForm?.get('to')?.getRawValue(),
        this.myForm?.get('message')?.getRawValue(),
        filesOnly
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (_) => {
          this.ref.close(true);
        },
        error: (_) => {
          this.dialogUtilsService.showErrorMessage();
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
    if (this.ref) {
      this.ref.close();
    }
  }
}
