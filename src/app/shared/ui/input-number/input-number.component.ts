import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tooltip } from 'primeng/tooltip';
import { InputService } from '../services/form/input.service';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, InputNumberModule, Tooltip],

  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [InputService],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() size: 'small' | 'large' = 'large';
  @Input({ required: true }) controlName = '';
  @Input() isRequired = false;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() disabled = false;
  @Input() styleClass = '';
  @Input() styleClassLabel = '';
  @Input() defaultValue = null;
  @Input() tooltip = false;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'top';
  @Input() tooltipText = '';
  @Input() isFormArray = false;
  @Input() customError = false;
  @Input() mode: 'decimal' | 'numbers' = 'numbers';
  @Input() useGrouping = true;
  @Input() suffix: string | undefined = undefined;
  @Input() isDisabled = false;

  readonly inputService = inject(InputService);

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }

  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      isRequired: this.isRequired,
      min: this.min,
      max: this.max,
      disabled: this.isDisabled,
    });
  }
}
