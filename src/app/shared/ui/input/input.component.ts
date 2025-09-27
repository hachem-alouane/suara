import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { InputService } from '../services/form/input.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    Tooltip,
    TranslateModule,
  ],
  providers: [InputService],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'password' | 'text' | 'number' | 'email' = 'text';
  @Input() iconLabel = '';
  @Input() styleClassIconLabel = '';
  @Input() helpText = '';
  @Input({ required: true }) controlName = '';
  @Input() isRequired = false;
  @Input() pattern = '';
  @Input() patternMessageError = '';
  @Input() email = false;
  @Input() minLength: string | number | null = null;
  @Input() maxLength: string | number | null = null;
  @Input() isDisabled = false;
  @Input() styleClass = '';
  @Input() styleClassLabel = '';
  @Input() customError = false;
  @Input() password = false;
  @Input() confirmPassword = false;
  @Input() tooltip = false;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'top';
  @Input() tooltipText = '';
  @Input() isFormArray = false;
  @Input() defaultValue = '';
  readonly inputService = inject(InputService);
  showPassword = false;

  ngOnInit(): void {
    if (this.password || this.confirmPassword) this.type = 'password';
    if (!this.isFormArray) this.initControl();
  }

  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      isRequired: this.isRequired,
      email: this.email,
      minLength: this.minLength,
      maxLength: this.maxLength,
      confirmPassword: this.confirmPassword,
      pattern: this.pattern,
      disabled: this.isDisabled,
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) this.type = 'text';
    else this.type = 'password';
  }
}
