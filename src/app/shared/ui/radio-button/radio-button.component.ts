import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { InputService } from '../services/form/input.service';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RadioButton],
  providers: [InputService],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
})
export class RadioButtonComponent implements OnInit {
  @Input() label = '';
  @Input({ required: true }) controlName = '';
  @Input() value = '';
  @Input() styleClass = '';
  @Input() disabled = false;
  @Input() size: 'small' | 'large' = 'large';
  @Input() defaultValue = false;
  @Input() isFormArray = false;

  readonly inputService = inject(InputService);

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }
  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
    });
  }
}
