/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
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
import { DialogService } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { combineLatest, finalize } from 'rxjs';
import { IPieceJointe } from '../../core/models/piece-jointe.interface';
import { ICols } from '../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../core/models/table/extras_column.enum';
import { TableType } from '../../core/models/table/table-type.enum';
import { LocaleService } from '../../data/services/config/local.service';
import { CourierService } from '../../data/services/courier.service';
import { GroupService } from '../../data/services/group.service';
import { MemberService } from '../../data/services/member.service';
import { CardPieceJointeUploadComponent } from '../../shared/components/card-piece-jointe-upload/card-piece-jointe-upload.component';
import { FocusInvalidInputDirective } from '../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputChipsComponent } from '../../shared/ui/input-chips/input-chips.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { MultipleSelectComponent } from '../../shared/ui/multiple-select/multiple-select.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { TextAreaComponent } from '../../shared/ui/textarea/textarea.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-write-message-admin',
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
    MultipleSelectComponent,
    ChipModule,
    InputChipsComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './write-message-admin.component.html',
  styleUrl: './write-message-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriteMessageAdminComponent implements AfterViewInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly courierService = inject(CourierService);
  private readonly memberService = inject(MemberService);
  private readonly groupService = inject(GroupService);
  private readonly localeService = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  selectedFiles: IPieceJointe[] = [];
  private readonly router = inject(Router);

  myForm: UntypedFormGroup = this.fb.group({});
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

  ngAfterViewInit(): void {
    this.listenToMembersChanges();
    this.listenToGroupMemberChanges();
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
  reset() {
    this.myForm.get('sender')?.patchValue('');
    this.myForm.get('listsender')?.patchValue('');
    this.myForm.get('members')?.patchValue('');
    this.myForm.get('groups')?.patchValue('');
    this.myForm.get('objet')?.patchValue('');
    this.myForm.get('description')?.patchValue('');
    this.selectedFiles = [];
    this.cdr.markForCheck();
  }
  sendMail() {
    if (this.myForm.invalid) return;
    const filesOnly: File[] = this.selectedFiles.map((piece) => piece.file!);
    this.loading = true;

    this.checkIfNoSenderSeted();
    const { groups, sender, listsender, members, ...data } =
      this.myForm?.getRawValue() ?? {};

    if (listsender?.length)
      listsender?.forEach((element: string) => {
        this.destinataires.push(element);
      });
    if (members?.length) {
      members?.forEach((element: any) => {
        this.destinataires = [...this.destinataires, ...(element?.email ?? '')];
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
      .writeMessageAdmin(
        uniqueDestinataires,
        this.myForm.get('objet')?.value,
        this.myForm.get('description')?.value,
        filesOnly
      )
      .subscribe({
        next: () => {
          this.dialogUtilsService.showSuccessMessage(
            this.localeService.translate('MESSAGE_REQUEST_ADDED_SUCCESS')
          );
          this.loading = false;
          this.cdr.markForCheck();
          this.router.navigateByUrl('/outgoing-correspondence');
        },
        error: (_) => {
          this.loading = false;
          this.cdr.markForCheck();

          this.dialogUtilsService.showErrorMessage();
        },
      });
  }
  private checkIfNoSenderSeted() {
    const { groups, sender, listsender, members } =
      this.myForm?.getRawValue() ?? {};
    if (!listsender?.length && !members?.length && !groups?.length) {
      this.dialogUtilsService.showErrorMessage(
        this.localeService.translate('NEED_RECIPIENT')
      );
      this.loading = false;
      this.cdr.markForCheck();
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
}
