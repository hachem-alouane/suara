import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputService } from '../services/form/input.service';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CheckboxModule, ReactiveFormsModule, FormsModule],
  providers: [InputService],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent implements OnInit {
  @Input() placeholder = '';
  @Input({ required: true }) controlName = '';
  @Input() isRequired = false;
  @Input() isDisabled = false;
  @Input() styleClass = '';
  @Input() isFormArray = false;
  @Input() defaultValue: string | number | boolean = '';
  @Input() binary = false;
  @Input() value = false;
  @Input() size: 'small' | 'large' = 'large';

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
