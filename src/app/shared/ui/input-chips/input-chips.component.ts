/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  ControlContainer,
  FormControl,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { InputService } from '../services/form/input.service';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-input-chips',
  standalone: true,
  imports: [
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    Tooltip,
    TranslateModule,
    ChipModule,
  ],
  providers: [InputService],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './input-chips.component.html',
  styleUrl: './input-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputChipsComponent implements OnInit {
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
  private readonly cdr = inject(ChangeDetectorRef);
  showPassword = false;

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;
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
      chipControlName: 'list' + this.controlName,
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) this.type = 'text';
    else this.type = 'password';
  }
  handleKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addItem(input.value);
      input.value = '';
    }
  }

  handleBlur() {
    const input = this.chipInput.nativeElement;
    this.addItem(input.value);
    input.value = '';
  }
  addItemFromParent(value: any) {
    const input = this.chipInput.nativeElement;
    this.addItem(value);
    input.value = '';
    this.cdr.markForCheck();
  }
  addItem(value: string) {
    if (!value) return;
    const formArray = this.inputService?.controlArray;
    if (!formArray) return;
    const items = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
    for (const item of items) {
      // Only add if it doesn't already exist
      if (!formArray.value.includes(item)) {
        formArray.push(new FormControl(item));
      }
    }
  }

  onDivKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.chipInput.nativeElement.focus();
    }
  }
  removeItem(index: number) {
    this.inputService?.controlArray?.removeAt(index);
  }
}
