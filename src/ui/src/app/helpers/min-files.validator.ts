
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minFilesValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as File[];
    if (!files || files.length < min) {
      return { minFiles: { required: min, actual: files?.length || 0 } };
    }
    return null;
  };
}
