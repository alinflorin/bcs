import { FormGroup } from "@angular/forms";
import { ErrorDto } from "../dto/error.dto";

export function setErrorDtoInFormValidation(form: FormGroup, errorDto: ErrorDto) {
  const keys = Object.keys(errorDto);
  for (let key of keys) {
    if (key === '') {
      // Global error
      form.setErrors({
        ...(form.errors || {}),
        backend: errorDto[key]
      });
      return;
    }
    const foundControl = form.get(key);
    if (foundControl) {
      // Per field
      foundControl.setErrors({
        ...(foundControl.errors || {}),
        backend: errorDto[key]
      });
    }
  }
}
