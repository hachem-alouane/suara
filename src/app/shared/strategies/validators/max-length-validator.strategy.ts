import { AbstractControl, Validators } from '@angular/forms';
import { IValidatorStrategy } from '../../../core/models/validators/validator-strategy.interface';
import { IValidatorsConfig } from '../../../core/models/validators/validators-config.interface';

export class MaxLengthValidatorStrategy implements IValidatorStrategy {
  addValidator(control: AbstractControl, config: IValidatorsConfig): void {
    if (config.maxLength && typeof config.maxLength === 'number') {
      control.addValidators([Validators.maxLength(config.maxLength)]);
    }
  }
}
