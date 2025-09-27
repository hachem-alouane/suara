import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
} from '@angular/forms';
import { IValidatorsConfig } from '../../../../core/models/validators/validators-config.interface';
import { ValidatorFactory } from '../../../factories/validator.factory';

@Injectable()
export class InputService {
  private _controlName = '';
  private _chipControlName = '';
  private _defaultValue: string | number | boolean | null = '';
  private _validatorsConfig: IValidatorsConfig | null = null;
  private readonly parentContainer = inject(ControlContainer);
  private readonly cdr = inject(ChangeDetectorRef);

  get parentFormGroup() {
    return this.parentContainer?.control as FormGroup; // Assuming parent form is FormGroup
  }
  initControl(name: string, options: IValidatorsConfig) {
    this._validatorsConfig = options;
    this._controlName = name;
    this._chipControlName = options?.chipControlName ?? '';
    this._defaultValue = options.defaultValue ?? null;
    this.addControl();
  }

  private addValidators() {
    const validatorFactory = new ValidatorFactory();
    validatorFactory.addValidators(
      this.control!,
      this._validatorsConfig!,
      this.parentFormGroup,
      this._controlName
    );
    this.cdr.markForCheck();
  }
  private addControl() {
    this.parentFormGroup.addControl(
      this._controlName,
      new FormControl({
        value: this._defaultValue,
        disabled: !!this._validatorsConfig?.disabled,
      }),

      { emitEvent: false }
    );
    if (this._chipControlName) {
      const control = new FormArray([]);

      this.parentFormGroup.addControl(this._chipControlName, control);
    }
    if (this._validatorsConfig) this.addValidators();
  }

  get control() {
    return this.parentFormGroup.get(this._controlName);
  }
  get controlArray() {
    return this.parentFormGroup.get(this._chipControlName) as FormArray;
  }
  get controlValid() {
    return this.control?.valid;
  }
  get controlInvalid() {
    return this.control?.invalid;
  }
  get controlHasRequiredError() {
    return this.control?.hasError('required');
  }
  get controlHasPatternError() {
    return this.control?.hasError('pattern');
  }
  get controlHasEmailError() {
    return this.control?.hasError('email');
  }

  get controlHasMinLengthError() {
    return this.control?.hasError('minlength');
  }
  get controlHasMinError() {
    return this.control?.hasError('min');
  }
  get confirmPasswordHasMatchError() {
    return this.control?.hasError('mismatch');
  }
  get submitted() {
    return (this.parentContainer as NgForm).submitted;
  }
}
