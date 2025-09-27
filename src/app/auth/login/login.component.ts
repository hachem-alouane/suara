import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Language } from '../../core/enums/language.enum';
import { TokenService } from '../../data/services/auth/token.service';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { DirectionService } from '../../data/services/config/direction.service';
import { LocaleService } from '../../data/services/config/local.service';
import { FocusInvalidInputDirective } from '../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { LinkButtonComponent } from '../../shared/ui/link-button/link-button.component';
import { HttpStatusCode } from '@angular/common/http';
import { Role } from '../../core/enums/role.enum';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TranslateModule,
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    FocusInvalidInputDirective,
    InputComponent,
    LinkButtonComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  myForm = this.fb.group({});
  Language = Language;
  errorInvalidCredential = false;
  errorAccountIsDisabled = false;

  private readonly userAuthService = inject(UserAuthService);
  private readonly tokenService = inject(TokenService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);
  private readonly directionService = inject(DirectionService);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentLanguage: any = Language.AR;
  loading = false;
  ngOnInit(): void {
    this.listenToFormChanges();
    this.currentLanguage = this.localeService.currentLocale;
  }
  login() {
    if (this.myForm.invalid) return;
    this.loading = true;
    this.userAuthService
      .login(
        this.myForm.get?.('username')?.getRawValue(),
        this.myForm.get?.('password')?.getRawValue()
      )
      .pipe(finalize(() => (this.loading = false)))

      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          this.tokenService.setToken(data?.accessToken);
          this.tokenService.setRefreshToken(data?.refreshToken);
          this.tokenService.changeAuthStatus(true);
          this.userAuthService.changeCurrentUser(data?.user);
          if (data?.user?.role?.name === Role.EMPLOYER) {
            this.router.navigateByUrl('/distributed-correspondence');
          } else this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          if (
            err?.status === HttpStatusCode.Unauthorized &&
            err?.error?.errorMessage === 'error.auth.invalid_credentials'
          ) {
            this.errorInvalidCredential = true;
            this.errorAccountIsDisabled = false;
          } else {
            this.errorInvalidCredential = false;
            this.errorAccountIsDisabled = true;
          }
          this.changeDetectorRef.markForCheck();
        },
      });
  }
  private listenToFormChanges() {
    this.myForm?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_) => {
        this.errorInvalidCredential = false;
        this.errorAccountIsDisabled = false;
      });
  }

  changeLanguage(language: Language) {
    if (this.currentLanguage === Language.AR)
      this.directionService.toggleIsRtl();
    this.localeService.initLocale(language);
    this.currentLanguage = language;
    this.userAuthService.changeCurrentLanguage(language);
    this.tokenService.setLanguage(language);
    location.reload();
  }
}
