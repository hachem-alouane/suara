/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Language } from '../../core/enums/language.enum';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { DirectionService } from '../../data/services/config/direction.service';
import { LocaleService } from '../../data/services/config/local.service';
import { FocusInvalidInputDirective } from '../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { LinkButtonComponent } from '../../shared/ui/link-button/link-button.component';
import { DialogUtilsService } from '../../shared/ui/services/dialogue/dialogue-util.service';

@Component({
  selector: 'app-reset-verification-account',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    FocusInvalidInputDirective,
    InputComponent,
    ButtonComponent,
  ],
  providers: [DialogService, DialogUtilsService, MessageService],
  templateUrl: './reset-verification-account.component.html',
  styleUrl: './reset-verification-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetVerificationAccountComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  myForm = this.fb.group({});
  errorInvalidCredential = false;
  errorToken = false;
  errorAccountIsDisabled = false;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userAuthService = inject(UserAuthService);
  private readonly localeService = inject(LocaleService);
  private readonly directionService = inject(DirectionService);
  private readonly dialogUtilsService = inject(DialogUtilsService);

  currentLanguage: any = Language.AR;
  Language = Language;
  token = '';
  verification = false;
  data1: any;

  ngOnInit() {
    const path = this.router.url.split('?')[0].toLowerCase();
    this.verification = path.includes('/auth/verify-account');
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorToken = true;
      return;
    }
  }

  changeLanguage(language: Language) {
    if (this.currentLanguage === Language.AR)
      this.directionService.toggleIsRtl();
    this.localeService.initLocale(language);
    this.currentLanguage = language;
    location.reload();
  }

  resetPassword() {
    if (this.myForm.invalid) return;
    this.userAuthService
      .resetPassword(this.token, this.myForm.get('password')?.getRawValue())
      .subscribe({
        next: () => {
          this.dialogUtilsService.showSuccessMessage('PASSWORD_RESET_SUCCESS');
          this.router.navigateByUrl('/auth/login');
        },
      });
  }

  verificationAccount() {
    if (this.myForm.invalid) return;
    this.userAuthService
      .verificationAccont(
        this.token,
        (this.data1 = this.myForm.get('password')?.getRawValue())
      )
      .subscribe({
        next: () => {
          this.dialogUtilsService.showSuccessMessage('PASSWORD_RESET_SUCCESS');
          this.router.navigateByUrl('/auth/login');
        },
      });
  }
}
