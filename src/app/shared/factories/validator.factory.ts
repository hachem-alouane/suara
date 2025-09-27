import { AbstractControl, FormGroup } from '@angular/forms';
import { ConfirmPasswordValidatorStrategy } from '../strategies/validators/confirm-password-validator.strategy';
import { EmailValidatorStrategy } from '../strategies/validators/email-validator.strategy';
import { MaxLengthValidatorStrategy } from '../strategies/validators/max-length-validator.strategy';
import { MinLengthValidatorStrategy } from '../strategies/validators/min-length-validator.strategy';
import { RequiredValidatorStrategy } from '../strategies/validators/required-validator.strategy';
import { MinValidatorStrategy } from '../strategies/validators/min-validator.strategy';
import { MaxValidatorStrategy } from '../strategies/validators/max-validator.strategy';
import { PatternStrategy } from '../strategies/validators/pattern.strategy';
import { IValidatorStrategy } from '../../core/models/validators/validator-strategy.interface';
import { IValidatorsConfig } from '../../core/models/validators/validators-config.interface';

export class ValidatorFactory {
  private readonly strategies: IValidatorStrategy[] = [
    new RequiredValidatorStrategy(),
    new EmailValidatorStrategy(),
    new MinLengthValidatorStrategy(),
    new MaxLengthValidatorStrategy(),
    new MinValidatorStrategy(),
    new MaxValidatorStrategy(),
    new ConfirmPasswordValidatorStrategy(),
    new PatternStrategy(),
  ];

  addValidators(
    control: AbstractControl,
    config: IValidatorsConfig,
    parentFormGroup?: FormGroup,
    controlName?: string
  ): void {
    this.strategies.forEach((strategy) => {
      strategy.addValidator(control, config, parentFormGroup, controlName);
    });
  }
}
