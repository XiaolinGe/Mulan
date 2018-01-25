import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PayerService} from '../../../services/payer.service';
import {Payer} from '../../../models/payer.model';
import {PayeeService} from '../../../services/payee.service';
import {Subscription} from 'rxjs/Subscription';
import {Payee} from '../../../models/payee.model';
import {BankAccount} from '../../../models/bank-account.model';
import {DropzoneComponent} from "ngx-dropzone-wrapper";
import {Constants} from "../../../constants/app.constant";
import {AuthenticationService} from "../../../services/authentication.service";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'mrp-payee-add',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: []
})
export class PayeeAddComponent implements OnInit {
  public payee: Payee = new Payee();
  public payerIdSubject: Subject<number> = new Subject<number>();
  public payer: Payer;
  public isEdit = false;
  public currencies: string[];
  public country: string;
  public payerId: number;
  public payers: Payer[];
  public isCollapsed = true;
  public myForm: FormGroup;
  public countries: string[];
  private sub: Subscription;
  public isBroker: boolean;

  public files: any = [];
  public filesFromServer: any;
  @ViewChild('dropzoneFile') dropzoneFile: DropzoneComponent;
  public config: any;

  constructor(private _fb: FormBuilder,
              public  router: Router,
              public authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              public payeeService: PayeeService,
              public payerService: PayerService) {
    this.isCollapsed = true;

    this.config = {
      headers: {'Authorization': 'Bearer ' + this.authenticationService.token},
      addRemoveLinks: true,
      clickable: true
    };

    this.isBroker = this.authenticationService.checkIsBroker();

  }

  // name: '',
  // country: '',
  // address: '',
  // city: '',
  // postCode: '',
  // payeeBankAccounts: []
  //
  ngOnInit() {
    this.initPayeeFormControl();
    this.getRouteParemeter();

    this.getPayerList();
    this.getCountryList();
    this.getCurrencies();

  }

  myPayerSelected($event) {
    console.log($event);
    if ($event) {
      this.payer = $event;
      this.payerId = this.payer.id;
    }
  }

  initPayeeFormControl() {
    this.myForm = this._fb.group({
      payerId: ['', [Validators.required]],
      name: ['', [Validators.required, hasPunctuation(',', 'commaError'), Validators.maxLength(35)]], // payee name: maxlength 35, no comma
      country: ['', [Validators.required]],
      addressLine1: ['', [Validators.required, hasPunctuation(',', 'commaError'), customRegexpValidator, Validators.maxLength(35)]],
      addressLine2: ['', [Validators.required, hasPunctuation(',', 'commaError'), customRegexpValidator, Validators.maxLength(35)]],
      city: ['', [Validators.required, customRegexpValidator]],
      postCode: ['', [Validators.required, hasPunctuation(',', 'commaError'), customRegexpValidator]], // only letters/numbers and / .  # -.
      payeeBankAccounts: this._fb.array([])
    });
  }

  // currency
  // accountName: '',
  // accountNumber: '',
  // accountCountry: '',
  // bankName: '',
  // branchName: '',
  // branchAddress: '',
  // clearingCode: '',
  // clearingCodeType: ''

  // https://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
  initBankAccountFormControl() {
    return this._fb.group({
      id: ['', []],
      currency: ['', [Validators.required]],
      accountCountry: ['', [Validators.required]],
      accountName: ['', [Validators.required, Validators.maxLength(35)]],
      accountNumber: ['', [accountNoRequired('needAccountNo')]],
      needAccountNo: [''],
      bankName: ['', [Validators.required, hasPunctuation(',', 'commaError')]],
      branchName: ['', [Validators.required, hasPunctuation(',', 'commaError')]],
      clearingCode: ['', [clearingCodeRequired('clearingCodeType')]],
      clearingCodeType: [''],
      swiftCode: ['', [swiftCodeRequired('needSwiftCode')]],
      needSwiftCode: ['']
    });
  }

  // Currency
  // Account Country
  // Account name
  // Account number
  // Bank Name
  // ABA
  // Branch Name

  addBankAccountFormControl() {
    const control = <FormArray>this.myForm.controls['payeeBankAccounts'];
    const addrCtrl = this.initBankAccountFormControl();
    control.push(addrCtrl);
  }

  removeBankAccountFormControl(i: number) {
    const control = <FormArray> this.myForm.controls['payeeBankAccounts'];
    control.removeAt(i);
  }

  getPayerList() {
    this.payerService.getAllByPaging(1, 20000).subscribe(resp => {
      console.log(resp);
      this.payers = resp.content;
      this.payerId = this.payers[0].id;
    })
  }

  getCountryList() {
    this.payerService.getCountries().subscribe(resp => {
      console.log(resp);
      this.countries = resp;
      // this.country = this.countries[0];
    });
  }

  getCurrencies() {
    this.payerService.getCurrencies().subscribe(resp => {
      console.log(resp);
      this.currencies = resp;
    });
  }

  getFormData() {
    return <FormArray>this.myForm.get('payeeBankAccounts');
  }

  onSubmit({value, valid}: { value: Payee, valid: boolean }) {
    delete value['bookedAt'];

    console.log(value, valid);
    value.attachments = [];
    this.files.forEach(f => {
      value.attachments.push({id: f.id});
    });

    if (this.isEdit) {

      if (this.payee && this.payee.payeeBankAccounts) {
        value.payeeBankAccounts = value.payeeBankAccounts.concat(this.payee.payeeBankAccounts);
      }

      this.payeeService.updatePayee(this.payee.id, value).subscribe(resp => {
        console.log(resp);
        this.router.navigate(['pages/payees/list']);
      });
    } else {
      this.payeeService.addPayee(this.payerId, value).subscribe(resp => {
        console.log(resp);
        this.router.navigate(['pages/payees/list']);
      });
    }
  }

  /**
   *  ------------------------------------------------------------
   *  ------------------  drop zone files BEGIN-----------------------
   *  ------------------------------------------------------------
   * */
  loadDropzoneFiles() {
    this.filesFromServer = this.payee.attachments;
    if (this.filesFromServer && this.filesFromServer.length > 0) {
      this.emitFiles();
    }
  }

  emitFiles() {
    this.filesFromServer.forEach(file => {
      // Call the default addedfile event handler
      this.dropzoneFile.directiveRef.dropzone.emit('addedfile', file);

      // And optionally show the thumbnail of the file:
      // dropzone.emit("thumbnail", this.files, "/image/url");
      // Or if the file on your server is not yet in the right
      // size, you can let Dropzone download and resize it
      // callback and crossOrigin are optional.
      this.dropzoneFile.directiveRef.dropzone.createThumbnailFromUrl(file);

      // Make sure that there is no progress bar, etc...
      this.dropzoneFile.directiveRef.dropzone.emit('complete', file);
      this.dropzoneFile.directiveRef.dropzone.emit('success', file, file, file);
    })
  }

  onUploadError(event) {
    console.log(event);
  }

  onUploadSuccess(file) {
    console.log(file);
    console.log('======= add file=======');

    // let a1 = document.createElement('a');
    // a1.setAttribute('href', Constants.API_ENDPOINT + file[1].fullPath);
    // a1.className = 'dz-remove';
    // a1.href = 'javascript:undefined;';
    // a1.setAttribute('data-dz-remove','');
    // a1.innerHTML = '<br><i class="fa fa-trash" aria-hidden="true"></i>remove';
    // file[0].previewTemplate.appendChild(a1);

    let a = document.createElement('a');
    a.setAttribute('href', Constants.API_ENDPOINT + file[1].fullPath);
    a.innerHTML = '<br><i class="fa fa-cloud-download" aria-hidden="true"></i>download';
    a.className = 'dz-download';
    a.setAttribute('download', '');
    file[0].previewTemplate.appendChild(a);

    if (file[1].fullPath.includes('.pdf')) {
      file[0].previewElement.querySelector('img').src = 'assets/img/vendor/pdf.png';
    }
    file[0].id = file[1].id;
    this.files.push(file[1]);
  }

  removedfile(file) {
    console.log(file);
    this.files = this.files.filter(item => item.id !== file.id);
    console.log(this.files);
  }

  /**
   *  ------------------------------------------------------------
   *  ------------------ drop zone files BEGIN------------------------
   *  ------------------------------------------------------------
   * */


  /**
   *  ------------------------------------------------------------
   *  ------------------  edit payee BEGIN------------------------
   *  ------------------------------------------------------------
   * */
  getRouteParemeter() {
    this.sub = this.route
      .params
      .subscribe(params => {
        // console.log(params);
        this.payerId = params['id'];
        if (this.payerId && this.payerId > 0) {
          // 编辑
          this.isEdit = true;
          this.getPayee(this.payerId);
        } else {
          // 新增
          this.isEdit = false;
          this.addBankAccountFormControl();
        }
      });
  }

  getPayee(id: number) {
    this.payeeService.getPayee(id).subscribe(resp => {
      this.payee = resp;
      this.payerId = this.payee.payer.id;
      // this.payer = this.payers.find(p => p.id === this.payerId);
      this.payerIdSubject.next(this.payerId);
      this.loadDropzoneFiles();
      // this.loadBankAccounts();
      console.log(resp);
    })
  }

  getBankAccount(i: number): BankAccount {
    if (this.isEdit && this.payee && this.payee.payeeBankAccounts) {
      return this.payee.payeeBankAccounts[i];
    }
  }

  loadBankAccounts() {
    const bankAccountsCtrls = (<FormArray>this.myForm.controls['payeeBankAccounts']).controls;
    while (bankAccountsCtrls.length < this.payee.payeeBankAccounts.length) {
      this.addBankAccountFormControl();
    }
  }


  /**
   *  -----------删除现有银行账户--------
   * */
  delbankAccount(account) {
    const index = this.payee.payeeBankAccounts.indexOf(account);
    this.payee.payeeBankAccounts.splice(index, 1);
  };

  /**
   *  ------------------------------------------------------------
   *  ------------------  edit payee END------------------------
   *  ------------------------------------------------------------
   * */
}

/**
 *  -----------Validation Functions--------
 * */
// 验证是否有标点
function hasPunctuation(punctuation: string, errorType: string) {
  return function (input: FormControl) {
    if (input && input.value) {
      return input.value.indexOf(punctuation) < 0 ?
        null :
        {[errorType]: true};
    }
  };
}


// https://scotch.io/tutorials/how-to-implement-conditional-validation-in-angular-2-model-driven-forms
// 当needSwiftCode为true时候，验证swift code是否有值
// export function swiftCodeRequired(needSwiftCode: string, swiftCode: string) {
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


export function swiftCodeRequired(needSwiftCode: string) {

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


// export function accountNoRequired(accountNumber: string, needAccountNo: string) {
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

export function accountNoRequired(needAccountNo: string) {

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


// export function clearingCodeRequired(clearingCode: string, clearingCodeType: string) {
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


export function clearingCodeRequired(clearingCodeType: string) {

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
export function customRegexpValidator(control: FormControl): { [key: string]: any } {
  let customRegexp = /^[a-zA-Z0-9\s,#./'-]*$/;
  if (control.value && !customRegexp.test(control.value)) {
    return {customError: true};
  }
}

/**
 * only letters/numbers
 * */
export function numberLetterOnlyValidator(control: FormControl): { [key: string]: any } {
  let numberLetterOnlyRegexp = /^[a-zA-Z0-9]*$/;
  if (control.value && !numberLetterOnlyRegexp.test(control.value)) {
    return {numberLetterOnlyError: true};
  }
}


/**
 * only letters/numbers/space
 * */
export function numberLetterSpaceValidator(control: FormControl): { [key: string]: any } {
  let numberLetterSpaceRegexp = /^[A-Za-z0-9 _]*$/;
  if (control.value && !numberLetterSpaceRegexp.test(control.value)) {
    return {numberLetterSpace: true};
  }
}


export function matchOtherValidator(otherControlName: string) {

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

