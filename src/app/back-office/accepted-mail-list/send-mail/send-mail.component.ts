/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe } from '@angular/common';
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
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ChipModule } from 'primeng/chip';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { combineLatest, finalize, forkJoin, Observable } from 'rxjs';
import { IDemande } from '../../../core/models/demande.interface';
import { IDocument } from '../../../core/models/document.interface';
import { IPieceJointe } from '../../../core/models/piece-jointe.interface';
import { ICols } from '../../../core/models/table/cols.interface';
import { TableType } from '../../../core/models/table/table-type.enum';
import { LocaleService } from '../../../data/services/config/local.service';
import { CourierService } from '../../../data/services/courier.service';
import { DemandeService } from '../../../data/services/demande.service';
import { GroupService } from '../../../data/services/group.service';
import { MemberService } from '../../../data/services/member.service';
import { PieceJointeService } from '../../../data/services/piece-jointe.service';
import { CardPieceJointeUploadComponent } from '../../../shared/components/card-piece-jointe-upload/card-piece-jointe-upload.component';
import { CardPieceJointeComponent } from '../../../shared/components/card-piece-jointe/card-piece-jointe.component';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { MultipleSelectComponent } from '../../../shared/ui/multiple-select/multiple-select.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { ExtrasColumn } from '../../../core/models/table/extras_column.enum';
import { InputChipsComponent } from '../../../shared/ui/input-chips/input-chips.component';

@Component({
  selector: 'app-send-mail',
  standalone: true,
  imports: [
    ButtonComponent,
    TranslateModule,
    TextAreaComponent,
    FocusInvalidInputDirective,
    ReactiveFormsModule,
    FormsModule,
    CardPieceJointeUploadComponent,
    SvgIconComponent,
    InputComponent,
    FieldsetModule,
    AsyncPipe,
    CardPieceJointeComponent,
    MultipleSelectComponent,
    ChipModule,
    InputChipsComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendMailComponent implements OnDestroy, OnInit, AfterViewInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly courierService = inject(CourierService);
  private readonly demandeService = inject(DemandeService);
  private readonly pieceJointeService = inject(PieceJointeService);
  private readonly memberService = inject(MemberService);
  private readonly groupService = inject(GroupService);
  private readonly localeService = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  documents$ = new Observable<IDocument[]>();
  selectedFiles: IPieceJointe[] = [];

  myForm: UntypedFormGroup = this.fb.group({});
  private readonly ref = inject(DynamicDialogRef);
  idDemande = !!this.dynamicDialogConfig?.data?.idDemande;
  requestSortedMail = !!this.dynamicDialogConfig?.data?.requestSortedMail;
  demande: IDemande | null = null;
  loading = false;
  members$ = this.memberService.getAll();
  groups$ = this.groupService.getAll();
  destinataires: string[] = [];
  columnsMember: ICols[] = [
    {
      header: 'NAME',
      field: 'nom',
      type: TableType.MEMBER,
      disableSort: true,
    },
    {
      header: 'ADDRESS',
      field: 'adresse',
      type: TableType.MEMBER,
      disableSort: true,
    },
    {
      header: 'EMAIL',
      field: 'email',
      type: TableType.MEMBER,
      disableSort: true,
      extras: ExtrasColumn.LIST_VALUE,
    },
    {
      header: 'PHONE',
      field: 'numTel',
      type: TableType.MEMBER,
      disableSort: true,
    },
  ];
  columnsGroups: ICols[] = [
    {
      header: 'NAME',
      field: 'name',
      type: TableType.GROUP,
      disableSort: true,
    },
    {
      header: 'MEMBERS',
      field: 'members',
      type: TableType.GROUP,
      disableSort: true,
      extras: ExtrasColumn.LIST_VALUE,
    },
  ];
  dataMembersView: any[] = [];
  dataGroupsMemberView: any[] = [];
  ngOnInit(): void {
    if (!this.requestSortedMail) this.loadSenderMail();
    this.loadDemandeById();
    this.loadAllDocuments();
  }

  ngAfterViewInit(): void {
    if (this.requestSortedMail) {
      this.listenToMembersChanges();
      this.listenToGroupMemberChanges();
    }
  }
  private listenToMembersChanges() {
    combineLatest([this.members$, this.myForm.get('members')!.valueChanges])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([allMembers, selectedEmails]) => {
        const filtered = allMembers
          .filter((m: any) => selectedEmails?.some((e: any) => e?.id === m?.id))
          .map(({ nom, adresse, email, numTel }) => ({
            nom,
            adresse,
            email,
            numTel,
          }));
        this.dataMembersView = [...filtered];
        this.cdr.markForCheck();
      });
  }
  private listenToGroupMemberChanges() {
    combineLatest([this.groups$, this.myForm.get('groups')!.valueChanges])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([allGroups, selectedGroup]) => {
        const infoToSend: any[] = [];
        let emailsaa: string[] = [];

        selectedGroup?.forEach((group: any) => {
          emailsaa = [];
          group?.membreEmailsDtos?.forEach((element: any) => {
            emailsaa = emailsaa.concat(element?.email);
          });

          infoToSend.push({ name: group?.lib, members: emailsaa });
        });

        this.dataGroupsMemberView = [...infoToSend];
        this.cdr.markForCheck();
      });
  }

  private loadSenderMail() {
    this.demandeService
      .getSenderMail(this.dynamicDialogConfig.data?.idDemande)
      .subscribe((data: string) => {
        this.myForm.get('sender')?.patchValue(data);
        this.cdr.markForCheck();
      });
  }
  private loadAllDocuments() {
    this.documents$ = this.pieceJointeService.getAlldocumentsByIdDemande(
      this.dynamicDialogConfig.data?.idDemande
    );
  }
  private loadDemandeById() {
    this.demandeService
      .getDemandeById(this.dynamicDialogConfig.data?.idDemande)
      .subscribe((data) => {
        this.demande = data;
        this.myForm.patchValue(data);
        this.cdr.markForCheck();
      });
  }
  cancel() {
    this.ref.close();
  }
  sendMail() {
    if (this.myForm.invalid) return;
    const filesOnly: File[] = this.selectedFiles.map((piece) => piece.file!);
    this.loading = true;
    if (!this.requestSortedMail) {
      this.courierService
        .sendAcceptedMail(
          this.dynamicDialogConfig?.data?.idDemande,
          this.myForm.get('sender')?.getRawValue(),
          this.myForm.get('objet')?.value,
          this.myForm.get('description')?.value,
          filesOnly
        )
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (_) => {
            this.dialogUtilsService.showErrorMessage();
          },
        });
    } else {
      this.checkIfNoSenderSeted();
      const { groups, sender, listsender, members, ...data } =
        this.myForm?.getRawValue() ?? {};
      if (listsender?.length)
        listsender?.forEach((element: string) => {
          this.destinataires.push(element);
        });
      if (members?.length) {
        members?.forEach((element: any) => {
          this.destinataires = [
            ...this.destinataires,
            ...(element?.email ?? ''),
          ];
        });
      }
      if (groups?.length) {
        groups?.forEach((element: any) => {
          element?.membreEmailsDtos?.forEach((el: any) => {
            this.destinataires = [...this.destinataires, ...(el?.email ?? '')];
          });
        });
      }
      const uniqueDestinataires = [...new Set(this.destinataires)];
      this.courierService
        .sendAcceptedMailIntern(
          this.dynamicDialogConfig?.data?.idDemande,
          uniqueDestinataires,
          this.myForm.get('objet')?.value,
          this.myForm.get('description')?.value,
          filesOnly
        )
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (_) => {
            this.dialogUtilsService.showErrorMessage();
          },
        });
    }
  }
  private checkIfNoSenderSeted() {
    const { groups, sender, listsender, members } =
      this.myForm?.getRawValue() ?? {};
    if (!listsender?.length && !members?.length && !groups?.length) {
      this.dialogUtilsService.showErrorMessage(
        this.localeService.translate('NEED_RECIPIENT')
      );
      this.loading = false;
    }
  }
  onFileSelected(event: any) {
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
  updateComp() {
    this.loadAllDocuments();
  }
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
