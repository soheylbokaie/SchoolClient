import { FormControl, FormGroup, FormGroupName } from '@angular/forms';

export function lowercaseValidator(c: FormControl) {
  const regex = /[a-z]/g;
  return regex.test(c.value) ? null : { lowercase: true };
}
export function UppercaseValidator(c: FormControl) {
  const regex = /[A-Z]/g;
  return regex.test(c.value) ? null : { uppercase: true };
}

export function UniqueChars(c: FormControl) {
  const regex = /\W/g;
  return regex.test(c.value) ? null : { uniqueChars: true };
}
export function Digit(c: FormControl) {
  const regex = /[1-9]/g;
  return regex.test(c.value) ? null : { digit: true };
}

export function ConfirmCheck(c: FormControl) {
  const confirmPassword = c.value;
  const password = c?.parent?.controls.password?.value;
  return confirmPassword == password ? null : { matched: true };
}
