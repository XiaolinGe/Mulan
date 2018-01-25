import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs/Subscription';
import {BusyConfig, IBusyConfig} from "angular2-busy";
import {ToastrConfig, ToastrService} from "ngx-toastr";
import {AccountService} from "../../services/account.service";
import {MessageService} from "../../services/message.service";
import {SplashScreenService} from "../../services/splash.screen.service";

@Component({
  selector: 'az-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public router: Router;
  public form: FormGroup;
  public email: AbstractControl;
  public username: AbstractControl;
  public password: AbstractControl;
  public busy: Subscription;
  public busyConfig: IBusyConfig;
  public loading: boolean;

  constructor(router: Router, fb: FormBuilder,
              public authService: AuthenticationService,
              public accountService: AccountService,
              public splashScreen: SplashScreenService,
              public messageService: MessageService,
              public toastrService: ToastrService) {
    splashScreen.show();
    splashScreen.hide();
    this.router = router;
    this.form = fb.group({
      // 'email': ['', Validators.compose([Validators.required, emailValidator])],
      'username': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    // this.email = this.form.controls['email'];
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
    this.setValues();
  }

  setValues() {
    this.form
      .setValue({
        username: '',
        password: '',
      })
  }




}

export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return {invalidEmail: true};
  }
}
