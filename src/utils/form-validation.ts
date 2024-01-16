import { QInput } from 'quasar';

function isFormValid(inputRefs: (QInput | undefined)[]) {
  let hasError = false;
  for (const input of inputRefs) {
    if (input) {
      input.validate();
      if (input.hasError) {
        hasError = true;
      }
    }
  }
  return !hasError;
}

export { isFormValid };
