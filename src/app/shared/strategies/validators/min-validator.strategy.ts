import { AbstractControl, Validators } from '@angular/forms';
import { IValidatorStrategy } from '../../../core/models/validators/validator-strategy.interface';
import { IValidatorsConfig } from '../../../core/models/validators/validators-config.interface';

export class MinValidatorStrategy implements IValidatorStrategy {
  addValidator(control: AbstractControl, config: IValidatorsConfig): void {
    if (config.min && typeof config.min === 'number') {
      control.addValidators([Validators.min(config.min)]);
    }
  }
}
