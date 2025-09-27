import { AbstractControl, Validators } from '@angular/forms';
import { IValidatorStrategy } from '../../../core/models/validators/validator-strategy.interface';
import { IValidatorsConfig } from '../../../core/models/validators/validators-config.interface';

export class PatternStrategy implements IValidatorStrategy {
  addValidator(control: AbstractControl, config: IValidatorsConfig): void {
    if (config.pattern) {
      control.addValidators([Validators.pattern(config.pattern)]);
    }
  }
}
