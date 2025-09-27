import { AbstractControl, FormGroup } from '@angular/forms';
import { IValidatorStrategy } from '../../../core/models/validators/validator-strategy.interface';
import { IValidatorsConfig } from '../../../core/models/validators/validators-config.interface';
import { PasswordValidators } from '../../utils/password-validators';
export class ConfirmPasswordValidatorStrategy implements IValidatorStrategy {
  addValidator(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    control: AbstractControl,
    config: IValidatorsConfig,
    parentFormGroup: FormGroup,
    controlName: string
  ): void {
    if (config.confirmPassword && controlName) {
      parentFormGroup.addValidators([
        PasswordValidators.matchValidator('password', controlName),
      ]);
    }
  }
}
