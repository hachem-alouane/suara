import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { IDocument } from '../../../core/models/document.interface';
import { LocaleService } from '../../../data/services/config/local.service';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { SelectButtonComponent } from '../../ui/select-button/select-button.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogUtilsService } from '../../ui/services/dialogue/dialogue-util.service';
import { ConfirmationService } from 'primeng/api';
import { ShowPreviewComponent } from './show-preview/show-preview.component';

@Component({
  selector: 'app-card-piece-jointe',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    SelectButtonComponent,
  ],
  templateUrl: './card-piece-jointe.component.html',
  styleUrl: './card-piece-jointe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class CardPieceJointeComponent implements AfterViewInit {
  @Input({ required: true }) document!: IDocument;
  @Input() toForwardActions = false;
  @Input() showDelete = false;
  @Output() updateTreeEv = new EventEmitter<boolean>();

  ref!: DynamicDialogRef;

  private readonly fb = inject(NonNullableFormBuilder);
  myForm: UntypedFormGroup = this.fb.group({});
  private readonly pieceJointeService = inject(PieceJointeService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly localeService = inject(LocaleService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly cdr = inject(ChangeDetectorRef);

  listOfBinaryValue = [
    {
      name: this.localeService.translate('YES'),
      value: true,
      icon: 'pi-check',
    },
    {
      name: this.localeService.translate('NO'),
      value: false,
      icon: 'pi-times',
    },
  ];

  ngAfterViewInit(): void {
    if (this.toForwardActions) {
      this.listenToForwardActions();
      this.setupForwarded();
    }
  }
  private setupForwarded() {
    this.myForm
      ?.get('forwarded')
      ?.patchValue(this.document?.toForward, { emitEvent: false });
  }
  private listenToForwardActions() {
    this.myForm
      ?.get('forwarded')
      ?.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.pieceJointeService
            .addFileToForward(this.document.id!)
            .subscribe(() => {
              this.dialogUtilsService.showSuccessMessage(
                this.localeService.translate('FILE_ADDED_TO_EMAIL')
              );
            });
        } else {
          this.pieceJointeService
            .removeFileToForward(this.document.id!)
            .subscribe(() => {
              this.dialogUtilsService.showSuccessMessage(
                this.localeService.translate('FILE_REMOVED_FROM_EMAIL')
              );
            });
        }
      });
  }
  previewFile(fileId: string, filename: string) {
    this.dialogUtilsService
      .openDialog(
        ShowPreviewComponent,
        this.localeService.translate('DOCUMENT_NAME') + ' : ' + filename,
        {
          fileId,
        },
        false,
        'w-10'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
  }
  downloadFile(fileId: string, filename: string) {
    this.pieceJointeService.downloadDocument(fileId).subscribe({
      next: (response) => {
        let fileName = filename || 'fichier';

        // Try to extract filename from content-disposition if not passed
        if (!filename) {
          const contentDisposition = response.headers.get(
            'content-disposition'
          );
          if (contentDisposition?.includes('filename=')) {
            const match = contentDisposition.match(
              /filename[^;=\n]*=(['"]?)(.*?)\1/
            );
            if (match?.[2]) {
              fileName = decodeURIComponent(match[2]);
            }
          }
        }

        const contentType =
          response.headers.get('content-type') ?? 'application/octet-stream';
        const blob = new Blob([response.body!], { type: contentType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        link.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          link.remove();
        }, 100);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement:', err);
      },
    });
  }
  showDeleteConfirm() {
    this.confirmationService.confirm({
      header: this.localeService.translate('CONFIRM_DELETE_FILE'),
      message: this.localeService.translate('ACTION_IRREVERSIBLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.localeService.translate('YES'),
      rejectLabel: this.localeService.translate('CANCEL'),
      acceptButtonStyleClass:
        'p-button  p-button-success ml-2 border-round-sm ',
      rejectButtonStyleClass:
        'p-button  surface-400 hover:surface-600 border-none border-round-sm ',
      accept: () => {
        this.deleteFile();
      },
    });
  }

  deleteFile() {
    this.pieceJointeService.deleePieceJointeById(this.document.id!).subscribe({
      next: () => {
        this.dialogUtilsService.showSuccessMessage(
          this.localeService.translate('DELETE_SUCCESS')
        );
        this.updateTreeEv.emit(true);
      },
      error: () => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
}
