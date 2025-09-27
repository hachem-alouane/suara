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
import { IUser } from '../../../core/models/user.interface';
import { UserAuthService } from '../../../data/services/auth/user-auth.service';
import { LocaleService } from '../../../data/services/config/local.service';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-details-users',
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
  ],
  providers: [DialogService, DialogUtilsService],
  templateUrl: './details-users.component.html',
  styleUrl: './details-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsUsersComponent implements OnInit, OnDestroy, AfterViewInit {
  ref2!: DynamicDialogRef;
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly localeService = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly userAuthService = inject(UserAuthService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myForm: UntypedFormGroup = this.fb.group({});
  private readonly ref = inject(DynamicDialogRef);
  userId = this.dynamicDialogConfig?.data?.id;
  errorDuplicatedMail = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles$ = this.userAuthService.getAllRoles().pipe(
    map((roles: any) =>
      roles
        .filter((role: any) => role?.name !== 'SUPERADMIN')
        .map((role: any) => ({
          ...role,
          translatedName: this.localeService.translate(role?.name),
        }))
    )
  );

  ngOnInit(): void {
    this.listenToForm();
  }
  ngAfterViewInit(): void {
    if (this.userId) {
      this.loadUser();
    }
  }
  private loadUser() {
    this.userAuthService.getUserById(this.userId).subscribe((user) => {
      this.setUpForm(user);
    });
  }

  setUpForm(user: IUser) {
    this.myForm.patchValue(user);
    this.myForm.get('role')?.setValue({
      ...user?.role,
      translatedName: this.localeService.translate(user?.role?.name || ''),
    });
    this.changeDetectorRef.markForCheck();
    // this.myForm.patchValue(this.dynamicDialogConfig?.data?.example);
    // const { nomEmp, prenomEmp, adresseEmp, emailEmp, membre } =
    //   this.dynamicDialogConfig?.data?.example ?? '';

    // this.myForm.get('nomMembreArabosai')?.patchValue(nomEmp);
    // this.myForm.get('prenomMembreArabosai')?.patchValue(prenomEmp);
    // this.myForm.get('adresseResponsableMembre')?.patchValue(adresseEmp);
    // this.myForm.get('emailResponsableMembre')?.patchValue(emailEmp);
    // this.myForm.get('poste')?.patchValue(membre?.poste);
  }
  listenToForm() {
    this.myForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.errorDuplicatedMail = false;
      });
  }

  register() {
    if (this.myForm.invalid) return;
    if (this.userId) {
      const { role, ...data } = this.myForm.getRawValue();

      const transformedData = {
        ...data,
        role: { name: role?.name },
      };
      this.userAuthService.updateUser(transformedData, this.userId).subscribe({
        next: (_) => {
          this.ref.close(true);
        },
        error: (err) => {
          if (
            err?.status === HttpStatusCode.Conflict &&
            err?.error?.errorMessage === 'error.validation.duplicate_email'
          ) {
            this.errorDuplicatedMail = true;
            this.dialogUtilsService.showErrorMessage('EMAIL_ALREADY_EXISTS');
          }
          this.changeDetectorRef.markForCheck();
        },
      });
    } else {
      this.userAuthService.createUser(this.myForm.getRawValue()).subscribe({
        next: (_) => {
          this.ref.close(true);
        },
        error: (err) => {
          if (
            err?.status === HttpStatusCode.Conflict &&
            err?.error?.errorMessage === 'error.validation.duplicate_email'
          ) {
            this.errorDuplicatedMail = true;
            this.dialogUtilsService.showErrorMessage('EMAIL_ALREADY_EXISTS');
          }
          this.changeDetectorRef.markForCheck();
        },
      });
    }
  }

  cancel() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  save() {}
  annuler() {}
}
