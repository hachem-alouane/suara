import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputService } from '../services/form/input.service';

@Component({
  selector: 'app-select-button',
  standalone: true,
  imports: [SelectButtonModule, ReactiveFormsModule, FormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [InputService],
  templateUrl: './select-button.component.html',
  styleUrl: './select-button.component.scss',
})
export class SelectButtonComponent implements OnInit {
  @Input() label = '';
  @Input({ required: true }) controlName = '';
  @Input({ required: true }) optionLabel = '';
  @Input({ required: true }) optionValue = '';
  @Input() isRequired = false;
  @Input() multiple = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) listValues: any[] = [];
  @Input() styleClass = '';
  @Input() styleClassLabel = '';
  @Input() size: 'small' | 'large' = 'large';
  @Input() defaultValue: string | number | boolean | null = null;
  @Input() isFormArray = false;
  @Input() customError = false;
  @Input() allowEmpty = false;
  @Input() isDisabled = false;

  readonly inputService = inject(InputService);

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }

  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      isRequired: this.isRequired,
      disabled: this.isDisabled,
    });
  }
}
