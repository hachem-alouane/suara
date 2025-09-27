/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe } from '@angular/common';
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
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IDocument } from '../../../core/models/document.interface';
import { LocaleService } from '../../../data/services/config/local.service';
import { CourierService } from '../../../data/services/courier.service';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { DynamicDatePipe } from '../../../shared/pipes/dynamic-date.pipe';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { ISensCr } from '../../../core/models/sensr.interface';

@Component({
  selector: 'app-details-distributed-correspondence',
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
  ],
  templateUrl: './details-distributed-correspondence.component.html',
  styleUrl: './details-distributed-correspondence.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class DetailsDistributedCorrespondenceComponent
  implements OnInit, OnDestroy
{
  ref2!: DynamicDialogRef;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly courierService = inject(CourierService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);
  private readonly pieceJointeService = inject(PieceJointeService);

  myForm = this.fb.group<any>({});
  private readonly ref = inject(DynamicDialogRef);
  documents$ = new Observable<IDocument[]>();
  mail!: any;
  sensrs: ISensCr[] = [];
  ngOnInit(): void {
    this.loadMailDetails();
    this.loadAllDocuments();
    this.loadAllsens();
  }
  private loadAllsens() {
    this.courierService.getAllSensCourrier().subscribe((data) => {
      this.sensrs = data;
    });
  }
  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getListePieceForCourrierDispatche(
      this.dynamicDialogConfig.data?.id
    );
  }
  private loadMailDetails() {
    this.courierService
      .getcourrier(this.dynamicDialogConfig.data?.id)
      .subscribe((data) => {
        this.mail = data;
        this.setupForm();
      });
  }
  register() {}
  private setupForm() {
    this.myForm.patchValue(this.mail);
    this.myForm.get('sensCr')?.patchValue(this.mail?.sensCr?.idSensCr);
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
