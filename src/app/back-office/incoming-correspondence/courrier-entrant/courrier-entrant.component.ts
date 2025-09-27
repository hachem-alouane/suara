/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Observable, take } from 'rxjs';
import { IDocument } from '../../../core/models/document.interface';
import { CourierService } from '../../../data/services/courier.service';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { AsyncPipe } from '@angular/common';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CourrierEntrantDetailsComponent } from './courrier-entrant-details/courrier-entrant-details.component';
import { LocaleService } from '../../../data/services/config/local.service';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';
import { ReturnBackButtonComponent } from '../../../shared/components/return-back-button/return-back-button.component';

@Component({
  selector: 'app-courrier-entrant',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    TranslateModule,
    ButtonComponent,
    CardPieceJointeComponent,
    LinkButtonComponent,
    ReturnBackButtonComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './courrier-entrant.component.html',
  styleUrl: './courrier-entrant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourrierEntrantComponent implements OnInit {
  @Input() id = '';
  documents$ = new Observable<IDocument[]>();
  mail!: any;
  private readonly pieceJointeService = inject(PieceJointeService);
  private readonly courierService = inject(CourierService);
  private readonly localeService = inject(LocaleService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  ref!: DynamicDialogRef;

  ngOnInit(): void {
    this.loadMailDetails();
    this.loadAllDocuments();
  }

  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getAlldocumentsById(+this.id);
  }
  private loadMailDetails() {
    this.courierService.getCourierById(+this.id).subscribe((data) => {
      this.mail = data;
      this.cdr.markForCheck();
    });
  }
  showDetails() {
    this.dialogUtilsService
      .openDialog(
        CourrierEntrantDetailsComponent,
        this.localeService.translate('CORRESPONDENCE_DETAILS') +
          ' : ' +
          this.mail?.referenceCourrier,
        {
          mail: this.mail,
        },
        false,
        'w-7'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
    this.ref.onClose.pipe(take(1)).subscribe((_) => {
      // if (result?.name) {
      //   this.dialogUtilsService.showSuccessMessage(
      //     "L'utilisateur <strong>" +
      //       result?.name +
      //       '</strong> a été ajouté avec succès.'
      //   );
      //   this.tableUsers.tableService.setDataList();
      // }
    });
  }
}
