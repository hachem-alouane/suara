import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { InputService } from '../services/form/input.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    TextareaModule,
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
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextAreaComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() rows = 5;
  @Input() iconLabel = '';
  @Input() styleClassLabel = '';
  @Input() helpText = '';
  @Input({ required: true }) controlName = '';
  @Input() isRequired = false;
  @Input() minLength: string | number | null = null;
  @Input() maxLength: string | number | null = null;
  @Input() isDisabled = false;
  @Input() styleClass = '';
  @Input() customError = false;
  @Input() tooltip = false;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'top';
  @Input() tooltipText = '';
  @Input() isFormArray = false;
  @Input() defaultValue = '';
  readonly inputService = inject(InputService);
  showPassword = false;

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }

  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      isRequired: this.isRequired,
      minLength: this.minLength,
      maxLength: this.maxLength,
      disabled: this.isDisabled,
    });
  }
}
