import { AbstractControl, FormGroup } from '@angular/forms';
import { IValidatorsConfig } from './validators-config.interface';

export interface IValidatorStrategy {
  addValidator(
    control: AbstractControl,
    config: IValidatorsConfig,
    parentFormGroup?: FormGroup,
    controlName?: string
  ): void;
}
