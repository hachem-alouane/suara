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
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { Language } from '../../../core/enums/language.enum';
import { TableType } from '../../../core/models/table/table-type.enum';
import { UserAuthService } from '../../../data/services/auth/user-auth.service';
import { CountryService } from '../../../data/services/country.service';
import { MemberService } from '../../../data/services/member.service';
import { OrganizationService } from '../../../data/services/organization.service';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { InputChipsComponent } from '../../../shared/ui/input-chips/input-chips.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { LocaleService } from '../../../data/services/config/local.service';

@Component({
  selector: 'app-details-member',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    FocusInvalidInputDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDocViewerModule,
    InputChipsComponent,
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './details-member.component.html',
  styleUrl: './details-member.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsMemberComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild('dropdownOrganisation') dropdownOrganisation!: DropdownComponent;
  @ViewChild('inputChipsListMail') inputChipsListMail!: InputChipsComponent;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly memberService = inject(MemberService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly countryService = inject(CountryService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ref = inject(DynamicDialogRef);
  private readonly userAuthService = inject(UserAuthService);
  private readonly organizationService = inject(OrganizationService);
  private readonly localeService = inject(LocaleService);
  readonly TableType = TableType;
  private readonly destroyRef = inject(DestroyRef);

  myForm: UntypedFormGroup = this.fb.group({});
  id = this.dynamicDialogConfig?.data?.id ?? '';
  errorNameDuplicated = false;
  errorMailDuplicated = false;
  countries$ = this.countryService.getAll();
  organisations$ = this.organizationService.getAll();

  currentLanguage = Language.AR;
  Language = Language;
  ngOnInit(): void {
    this.listenToFormChanges();
    this.listenToCurrentLanguage();
  }

  ngAfterViewInit(): void {
    if (this.id) this.loadMemberById(this.id);
  }
  private listenToCurrentLanguage() {
    this.userAuthService.currentLanguage
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currentAdminData) => {
        this.currentLanguage = currentAdminData as Language;
      });
  }
  private listenToFormChanges() {
    this.myForm?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.errorNameDuplicated = false;
        this.errorMailDuplicated = false;
      });
  }
  private loadMemberById(id: number) {
    this.memberService.getById(id).subscribe({
      next: (data) => {
        this.myForm.patchValue(data);
        if (data?.email?.length) {
          data?.email?.forEach((element) => {
            this.inputChipsListMail.addItemFromParent(element);
          });
        }
        this.myForm.get('email')?.patchValue('', { emitEvent: false });
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
    const { email, listemail, ...data } = this.myForm?.getRawValue() ?? {};
    const uniqueEmails = [...new Set(listemail)];
    const transformedData = { ...data, email: uniqueEmails };
    if (!uniqueEmails.length) {
      this.dialogUtilsService.showErrorMessage(
        this.localeService.translate('EMAIL_REQUIRED')
      );
      return;
    }
    if (this.id) {
      this.updateCountry(transformedData);
    } else {
      this.createContry(transformedData);
    }
  }

  private createContry(transformedData: any) {
    this.memberService.add(transformedData).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (err) => {
        if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_name'
        ) {
          this.errorNameDuplicated = true;
          this.errorMailDuplicated = false;
        } else if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_email'
        ) {
          this.errorNameDuplicated = false;
          this.errorMailDuplicated = true;
        }
        this.cdr.markForCheck();
      },
    });
  }

  private updateCountry(data: any) {
    this.memberService.update(this.id, data).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (err) => {
        if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_name'
        ) {
          this.errorNameDuplicated = true;
          this.errorMailDuplicated = false;
        } else if (
          err?.status === HttpStatusCode.Conflict &&
          err?.error?.errorMessage === 'error.validation.duplicate_email'
        ) {
          this.errorNameDuplicated = false;
          this.errorMailDuplicated = true;
        }
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.ref?.close();
  }
}
