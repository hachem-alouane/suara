/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
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
import { TableType } from '../../../core/models/table/table-type.enum';
import { GroupService } from '../../../data/services/group.service';
import { HttpStatusCode } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { MemberService } from '../../../data/services/member.service';
import { AsyncPipe } from '@angular/common';
import { MultipleSelectComponent } from '../../../shared/ui/multiple-select/multiple-select.component';
import { ICols } from '../../../core/models/table/cols.interface';
import { combineLatest } from 'rxjs';
import { ExtrasColumn } from '../../../core/models/table/extras_column.enum';

@Component({
  selector: 'app-details-group',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    FocusInvalidInputDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDocViewerModule,
    DropdownComponent,
    AsyncPipe,
    MultipleSelectComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './details-group.component.html',
  styleUrl: './details-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsGroupComponent implements AfterViewInit, OnDestroy, OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly groupService = inject(GroupService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly memberService = inject(MemberService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ref = inject(DynamicDialogRef);
  readonly TableType = TableType;
  private readonly destroyRef = inject(DestroyRef);

  members$ = this.memberService.getAll();

  myForm: UntypedFormGroup = this.fb.group({});
  idGroup = this.dynamicDialogConfig?.data?.id ?? '';
  errorCodeDuplicated = false;
  errorLibDuplicated = false;
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
  dataMembersView: any[] = [];

  ngOnInit(): void {
    this.listenToFormChanges();
  }

  ngAfterViewInit(): void {
    if (this.idGroup) this.loadGroupById(this.idGroup);
    this.listenToMembersChanges();
  }
  private listenToFormChanges() {
    this.myForm?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.errorCodeDuplicated = false;
        this.errorLibDuplicated = false;
      });
  }
  private listenToMembersChanges() {
    combineLatest([this.members$, this.myForm.get('membreIds')!.valueChanges])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([allMembers, selectedEmails]) => {
        const filtered = allMembers
          .filter((m: any) => selectedEmails?.includes(m?.id))
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
  private loadGroupById(id: number) {
    this.groupService.getById(id).subscribe({
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

    if (this.idGroup) {
      this.updateGroup(formData);
    } else {
      this.createCountry(formData);
    }
  }

  private createCountry(transformedData: any) {
    this.groupService.add(transformedData).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (err) => {
        if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_code'
        ) {
          this.errorCodeDuplicated = true;
          this.errorLibDuplicated = false;
        } else if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_name'
        ) {
          this.errorLibDuplicated = true;
          this.errorCodeDuplicated = false;
        }
        this.cdr.markForCheck();
      },
    });
  }

  private updateGroup(data: any) {
    this.groupService.update(this.idGroup, data).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (err) => {
        if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_code'
        ) {
          this.errorCodeDuplicated = true;
          this.errorLibDuplicated = false;
        } else if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_name'
        ) {
          this.errorLibDuplicated = true;
          this.errorCodeDuplicated = false;
        }
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.ref?.close();
  }
}
