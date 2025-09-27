import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputService } from '../services/form/input.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GroupRadioValues = {
  label: string;
  size: 'small' | 'large';
  value: boolean | string;
  styleClass?: string;
  styleClassLabel?: string;
};

@Component({
  selector: 'app-radio-button-group',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RadioButtonModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [InputService],
  templateUrl: './radio-button-group.component.html',
  styleUrl: './radio-button-group.component.scss',
})
export class RadioButtonGroupComponent implements OnInit {
  @Input({ required: true }) controlName = '';
  @Input({ required: true }) values: GroupRadioValues[] = [];
  @Input({ required: true }) defaultValue: string | number | boolean | null =
    true;
  @Input() isFormArray = false;
  @Input() isDisabled = false;

  readonly inputService = inject(InputService);

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }
  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      disabled: this.isDisabled,
    });
  }
}
