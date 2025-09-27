import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  ListOfArchive,
  ListOfCsv,
  ListOfDocuments,
  ListOfImages,
  ListOfMusic,
  ListOfPdf,
  ListOfSvgs,
  ListOfTiff,
  ListOfVideos,
} from '../../../../data/constants/list.constants';
import { PieceJointeService } from '../../../../data/services/piece-jointe.service';
import { ButtonComponent } from '../../../ui/button/button.component';
import { DialogUtilsService } from '../../../ui/services/dialogue/dialogue-util.service';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import * as UTIF from 'utif';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-show-preview',
  standalone: true,
  imports: [
    ButtonComponent,
    TranslateModule,
    NgxDocViewerModule,
    SafeHtmlPipe,
    SafeUrlPipe,
  ],
  templateUrl: './show-preview.component.html',
  styleUrl: './show-preview.component.scss',
  providers: [DialogService, DialogUtilsService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPreviewComponent implements OnDestroy, OnInit {
  tiffCanvas!: ElementRef<HTMLDivElement>;

  @ViewChild('tiffCanvasRef', { read: ElementRef }) set tiffCanvasSetter(
    el: ElementRef
  ) {
    if (
      el &&
      (this.listOfTiff.includes(this.contentTypeFile) ||
        this.listOfDocuments.includes(this.contentTypeFile))
    ) {
      this.tiffCanvas = el;
      this.renderTiff();
    }
  }

  private readonly ref = inject(DynamicDialogRef);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly pieceJointeService = inject(PieceJointeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogUtilsService = inject(DialogUtilsService);

  readonly listOfImages = ListOfImages;
  readonly listOfSvgs = ListOfSvgs;
  readonly listOfTiff = ListOfTiff;
  readonly listOfDocuments = ListOfDocuments;
  readonly listOfPdf = ListOfPdf;
  readonly listOfCsv = ListOfCsv;
  readonly listOfMusic = ListOfMusic;
  readonly listOfVideos = ListOfVideos;
  readonly listOfArchive = ListOfArchive;
  htmlTable = '';
  csvData: string[][] = [];

  fileUrl = '';
  contentTypeFile = '';
  fileId = this.dynamicDialogConfig?.data?.fileId;
  ngOnInit(): void {
    this.loadUrlSignedFromMinio();
  }
  private async renderTiff() {
    if (!this.tiffCanvas || !this.fileUrl) return;
    const res = await fetch(this.fileUrl);
    const buffer = await res.arrayBuffer();
    const tiffs = UTIF.decode(buffer);
    const firstPage = tiffs[0];
    UTIF.decodeImage(buffer, firstPage);
    const rgba = UTIF.toRGBA8(firstPage);

    const canvas = document.createElement('canvas');
    canvas.width = firstPage.width;
    canvas.height = firstPage.height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(firstPage.width, firstPage.height);
    imageData.data.set(rgba);
    ctx.putImageData(imageData, 0, 0);

    this.tiffCanvas.nativeElement.innerHTML = ''; // clear previous
    this.tiffCanvas.nativeElement.appendChild(canvas);
    this.cdr.markForCheck();
  }
  private loadUrlSignedFromMinio() {
    this.pieceJointeService.getSignedUrl(this.fileId).subscribe({
      next: async (response) => {
        this.fileUrl = response?.url;
        this.contentTypeFile = response?.contentType;
        if (this.listOfCsv.includes(this.contentTypeFile)) {
          this.renderCsv(this.fileUrl);
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.dialogUtilsService.showErrorMessage();
      },
    });
  }
  private async renderCsv(url: string) {
    const res = await fetch(url);
    const text = await res.text();

    // Split CSV rows
    const rows = text.split(/\r?\n/).filter((row) => row.trim() !== '');
    this.csvData = rows.map((row) => row.split(','));
    this.cdr.markForCheck();
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
