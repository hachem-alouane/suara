import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) {
        // if the control value is empty return no error.
        return null;
      }

      // test the value of the control against the regexp supplied.
      const valid = regex.test(control.value);
      // if true, return no error, otherwise return the error object passed in the second parameter.
      return valid ? null : error;
    };
  }
  static matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null; // No validation if one of the controls is missing
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({
          ...matchingControl.errors,
          mismatch: true,
        });
      } else {
        if (matchingControl.hasError('mismatch')) {
          const errors = { ...matchingControl.errors };
          delete errors['mismatch'];
          matchingControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }

      return null;
    };
  }
}
