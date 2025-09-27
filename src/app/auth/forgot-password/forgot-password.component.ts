/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';

import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Language } from '../../core/enums/language.enum';
import { DirectionService } from '../../data/services/config/direction.service';
import { LocaleService } from '../../data/services/config/local.service';
import { FocusInvalidInputDirective } from '../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { LinkButtonComponent } from '../../shared/ui/link-button/link-button.component';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpStatusCode } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    FocusInvalidInputDirective,
    InputComponent,
    ButtonComponent,
    ToastModule,
  ],
  providers: [DialogService, DialogUtilsService, MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  myForm = this.fb.group({});
  errorMailExist = false;
  private readonly router = inject(Router);
  private readonly userAuthService = inject(UserAuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly localeService = inject(LocaleService);
  private readonly directionService = inject(DirectionService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentLanguage: any = Language.AR;

  Language = Language;
  loading = false;
  ngOnInit(): void {
    this.listenToFormChanges();
  }
  private listenToFormChanges() {
    this.myForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.errorMailExist = false;
      });
  }
  forgot() {
    if (this.myForm.invalid) return;
    this.loading = true;
    this.userAuthService
      .forgotPassword({ email: this.myForm.get?.('email')?.getRawValue() })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.dialogUtilsService.showSuccessMessage(
            this.localeService.translate('EMAIL_SENT_SUCCESSFULLY')
          );
        },
        error: (err) => {
          if (
            err?.status === HttpStatusCode.NotFound &&
            err?.error?.errorMessage === 'error.entity.user_not_found'
          ) {
            this.errorMailExist = true;
          } else {
            this.errorMailExist = false;
          }
          this.cdr.markForCheck();
        },
      });
  }

  changeLanguage(language: Language) {
    if (this.currentLanguage === Language.AR)
      this.directionService.toggleIsRtl();
    this.localeService.initLocale(language);
    this.currentLanguage = language;

    location.reload();
  }
}
