import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map'
import {LocalStoreService} from './localStore.service';
import {Constants} from '../constants/app.constant';
import {User} from '../models/user.model';
import {MyHttp} from './http.client.service';
import {LoginResp} from "../models/login.resp.model";
import {HttpErrorHaddle} from "../theme/shared/http-error-handle/http.error.haddle";


@Injectable()
export class AuthenticationService {
  public user: User;
  public token: string;
  private userUrl = Constants.API_ENDPOINT + 'v1/user';

  constructor(private http: Http) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem(Constants.CurrentUser));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    // const params = new URLSearchParams;
    // params.append('username', username);
    // params.append('password', password);

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const options = new RequestOptions({headers: headers});

    const postData = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
    console.log(postData);
    return this.http.post(Constants.API_ENDPOINT + 'login', postData, options)
    // .map((response: Response) => {
    //   // console.log(response.json());
    //   // login successful if there's a jwt token in the response
    //   const token = response.json() && response.json().access_token;
    //   // console.log(token);
    //   if (token) {
    //     // set token property
    //     this.token = token;
    //
    //     // store username and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem(Constants.CurrentUser, JSON.stringify({username: username, token: token}));
    //
    //     // return true to indicate successful login
    //     return true;
    //   } else {
    //     return false;
    //   }

      .map((response: Response) => {
        console.log('=======token=====');
        console.log(response.json());
        // login successful if there's a jwt token in the response
        const loginResp: LoginResp = response.json();
        // console.log(token);
        if (loginResp.access_token) {
          // set token property
          this.token = loginResp.access_token;
          loginResp.loginSecond = new Date().getTime() / 1000;

          if (loginResp.type === Constants.USER.backend) {
            return false;
          }
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(Constants.CurrentUser, JSON.stringify(loginResp));

          // return true to indicate successful login
          return true;
        } else {
          return false;
        }
      }).catch(HttpErrorHaddle.handleError);
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem(Constants.CurrentUser);
    localStorage.removeItem(Constants.CurrentUserInfo);
  }

  getToken() {
    const t: LoginResp = JSON.parse(localStorage.getItem(Constants.CurrentUser));
    if (t) {
      return t.access_token;
    } else {
      return null;
    }
  }


  storeUserInfo(user: User) {
    localStorage.setItem(Constants.CurrentUserInfo, JSON.stringify(user));
  }

  getUserInfo() {
    let user: User = new User();
    user = JSON.parse(localStorage.getItem(Constants.CurrentUserInfo));
    return user;
  }

  checkIsBroker() {
    this.user = this.getUserInfo();
    if (this.user && this.user.userType === Constants.USER.broker) {
      return true;
    } else {
      return false;
    }
  }

}
