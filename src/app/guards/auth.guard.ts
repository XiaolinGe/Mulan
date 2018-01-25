import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {Constants} from '../constants/app.constant';
import {User} from '../models/user.model';
import {AuthenticationService} from '../services/authentication.service';
import {LoginResp} from "../models/login.resp.model";

@Injectable()
export class AuthGuard implements CanActivate {

  public user: User;

  constructor(public router: Router,
              public authService: AuthenticationService) {
    this.router.events.subscribe(resp => {
        this.checkExpired();
      }
    );
  }

  canActivate() {
    if (localStorage.getItem(Constants.CurrentUser)) {

      this.user = JSON.parse(localStorage.getItem(Constants.CurrentUser));
      // logged in so return true

      if (this.user.type === Constants.USER.backend) {
        this.destroyToken();
        return false;
      }

      this.checkExpired();
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }

  checkExpired() {
    if (localStorage.getItem(Constants.CurrentUser)) {
      const loginResp: LoginResp = JSON.parse(localStorage.getItem(Constants.CurrentUser));
      const now = new Date().getTime() / 1000;
      if (now - loginResp.loginSecond > loginResp.expires_in) {
        this.destroyToken();
      }
    }
  }

  destroyToken() {
    this.authService.logout();
    localStorage.removeItem(Constants.CurrentUser);
    localStorage.removeItem(Constants.CurrentUserInfo);
    this.router.navigate(['/login']);
  }

}
