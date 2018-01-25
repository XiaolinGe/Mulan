import {FormControl} from "@angular/forms";
import {isNullOrUndefined} from "util";

export class ValidationPattern {
  static passwordLetterDigi = '[\\da-zA-Z]*\\d+[a-zA-Z]+[\\da-zA-Z]*';

  /**
   *  -----------Validation Functions--------
   * */
// 验证是否有标点
  static hasPunctuation(punctuation: string, errorType: string) {
    return function (input: FormControl) {
      if (input && input.value) {
        return input.value.indexOf(punctuation) < 0 ?
          null :
          {[errorType]: true};
      }
    };
  }

  static emailValidator(control: FormControl): { [key: string]: any } {
    const customRegexp = /^\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/;
    if (control.value && !customRegexp.test(control.value)) {
      return {email: true};
    }
  }

  static currencyPositiveValidator(control: FormControl): { [key: string]: any } {
    const customRegexp = /^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/;
    if (control.value && !customRegexp.test(control.value)) {
      return {currencyPositive: true};
    }
  }

  static mustBeIdOption(control: FormControl): { [key: string]: any } {
    if (!(control.value > 0)) {
      return {required: true};
    }
  }

// https://scotch.io/tutorials/how-to-implement-conditional-validation-in-angular-2-model-driven-forms
// 当needSwiftCode为true时候，验证swift code是否有值
// static swiftCodeRequired(needSwiftCode: string, swiftCode: string) {
//   return (group: FormGroup) => {
//     if (group) {
//       const needSwiftCodeValue = group.controls[needSwiftCode];
//       const swiftCodeForm = group.controls[swiftCode];
//       if (needSwiftCodeValue.value === 'true' && swiftCodeForm.value === '') {
//         if (needSwiftCodeValue.value === 'true' && swiftCodeForm.value === '') {
//           return swiftCodeForm.setErrors({needSwiftCode: true})
//         }
//
//         if (needSwiftCodeValue.value === 'true' && swiftCodeForm.value !== '') {
//
//           // number-letter
//           let numberLetterOnlyRegexp = /^[a-zA-Z0-9]*$/;
//           if (swiftCodeForm.value && !numberLetterOnlyRegexp.test(swiftCodeForm.value)) {
//             return {numberLetterOnlyError: true};
//           }
//
//
//           if (swiftCodeForm.value.indexOf(',') > 0) {
//             return {commaError: true};
//           }
//
//         }
//       }
//     }
//   }
// }


  static swiftCodeRequired(needSwiftCode: string) {

    let thisControl: FormControl;
    let needSwiftCodeControl: FormControl;

    return function swiftCodeRequiredValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        needSwiftCodeControl = control.parent.get(needSwiftCode) as FormControl;
        if (!needSwiftCodeControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        needSwiftCodeControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!needSwiftCodeControl) {
        return null;
      }
      if (needSwiftCodeControl.value === true && (thisControl.value === '' || thisControl.value === undefined)) {
        return {
          required: true
        };
      }

      if (needSwiftCodeControl.value && thisControl.value) {
        let numberLetterOnlyRegexp = /^[a-zA-Z0-9]*$/;
        if (thisControl.value && !numberLetterOnlyRegexp.test(thisControl.value)) {
          return {numberLetterOnlyError: true};
        }

        if (thisControl.value && thisControl.value.indexOf(',') > 0) {
          return {commaError: true};
        }
      }
      return null;
    }
  }


// static accountNoRequired(accountNumber: string, needAccountNo: string) {
//   return (group: FormGroup) => {
//     if (group) {
//       const needAccountNoValue = group.controls[needAccountNo];
//       const accountNumberForm = group.controls[accountNumber];
//       if (needAccountNoValue.value === 'true' && needAccountNoValue.value === '') {
//         return accountNumberForm.setErrors({needAccountNo: true})
//       }
//       let numberLetterSpaceRegexp = /^[A-Za-z0-9 _]*$/;
//       if (accountNumberForm.value && !numberLetterSpaceRegexp.test(accountNumberForm.value)) {
//         return {numberLetterSpace: true};
//       }
//     }
//   }
// }

  static accountNoRequired(needAccountNo: string) {

    let thisControl: FormControl;
    let needAccountNoControl: FormControl;

    return function accountNoRequiredValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        needAccountNoControl = control.parent.get(needAccountNo) as FormControl;
        if (!needAccountNoControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        needAccountNoControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!needAccountNoControl) {
        return null;
      }

      if (needAccountNoControl.value !== '' && (thisControl.value === '' || thisControl.value === undefined)) {
        return {
          required: true
        };
      }

      if (needAccountNoControl.value !== '' && thisControl.value !== '') {
        // number letter only
        let numberLetterSpaceRegexp = /^[A-Za-z0-9 _]*$/;
        if (thisControl.value && !numberLetterSpaceRegexp.test(thisControl.value)) {
          return {numberLetterSpace: true};
        }
      }
      return null;
    }
  }


// static clearingCodeRequired(clearingCode: string, clearingCodeType: string) {
//   return (group: FormGroup) => {
//     if (group) {
//       const clearingCodeTypeValue = group.controls[clearingCodeType];
//       const clearingCodeForm = group.controls[clearingCode];
//       if (clearingCodeTypeValue.value !== '' && clearingCodeForm.value === '') {
//         return clearingCodeForm.setErrors({needClearingCode: true})
//       }
//
//       if (clearingCodeTypeValue.value !== '' && clearingCodeForm.value !== '') {
//         // number letter only
//         let numberLetterOnlyRegexp = /^[a-zA-Z0-9]*$/;
//         if (clearingCodeForm.value && !numberLetterOnlyRegexp.test(clearingCodeForm.value)) {
//           return {numberLetterOnlyError: true};
//         }
//       }
//     }
//   }
// }


  static clearingCodeRequired(clearingCodeType: string) {

    let thisControl: FormControl;
    let clearingCodeTypeControl: FormControl;

    return function clearingCodeRequiredValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        clearingCodeTypeControl = control.parent.get(clearingCodeType) as FormControl;
        if (!clearingCodeTypeControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        clearingCodeTypeControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!clearingCodeTypeControl) {
        return null;
      }

      if (clearingCodeTypeControl.value !== '' && (thisControl.value === '' || thisControl.value === undefined)) {
        return {
          required: true
        };
      }

      if (clearingCodeTypeControl.value !== '' && thisControl.value !== '') {
        // number letter only
        let numberLetterOnlyRegexp = /^[a-zA-Z0-9]*$/;
        if (thisControl.value && !numberLetterOnlyRegexp.test(thisControl.value)) {
          return {numberLetterOnlyError: true};
        }
      }
      return null;
    }
  }

  /**
   * only letters/numbers and / .  # -
   * */
  static customRegexpValidator(control: FormControl): { [key: string]: any } {
    let customRegexp = /^[a-zA-Z0-9\s,#./'-]*$/;
    if (control.value && !customRegexp.test(control.value)) {
      return {customError: true};
    }
  }

  /**
   * only letters/numbers
   * */
  static numberLetterOnlyValidator(control: FormControl): { [key: string]: any } {
    let numberLetterOnlyRegexp = /^[a-zA-Z0-9]*$/;
    if (control.value && !numberLetterOnlyRegexp.test(control.value)) {
      return {numberLetterOnlyError: true};
    }
  }

  /**
   * only letters/numbers/space
   * */
  static numberLetterSpaceValidator(control: FormControl): { [key: string]: any } {
    let numberLetterSpaceRegexp = /^[A-Za-z0-9 _]*$/;
    if (control.value && !numberLetterSpaceRegexp.test(control.value)) {
      return {numberLetterSpace: true};
    }
  }


  static matchOtherValidator(otherControlName: string) {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          matchOther: true
        };
      }
      return null;
    }
  }
}
