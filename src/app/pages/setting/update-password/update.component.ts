import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'mrp-update-password',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  providers: []
})
export class UpdateComponent implements OnInit {

  public myForm: FormGroup;

  confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  constructor(private _fb: FormBuilder,
              public router: Router,
              public toastrService: ToastrService,
              public accountService: AccountService) {

  }

  ngOnInit(): void {
    this.initPayeeFormControl();

  }

  initPayeeFormControl() {
    this.myForm = this._fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, matchOtherValidator('newPassword')]]
    });
  }


  onSubmit({value, valid}: { value: any, valid: boolean }) {
    console.log(value, valid);
    this.accountService.updatePassword(value).subscribe(resp => {
      console.log(resp);
      // this.router.navigate(['pages/login']);
      this.toastrService.success('The password has been successfully changed.');
      this.myForm.reset();
    },err => {
      console.log(err);
      this.toastrService.error('The old password do not match.')
      // this.toastrService.error(err);
    });
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

