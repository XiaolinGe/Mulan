import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {AuthenticationService} from './authentication.service';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {ResetUser} from '../models/reset-user.model';

@Injectable()
export class AccountService {

  private url: string = Constants.API_ENDPOINT + 'values';
  private authUrl: string = Constants.API_ENDPOINT + 'token';
  private userUrl = Constants.API_ENDPOINT + 'v1/user';
  private profileUrl = Constants.API_ENDPOINT + 'v1/user/profile';

  // private authUrl: string = 'http://app.com/api/accounts/create';

  constructor(private myHttp: MyHttp,
              public http: Http,
              private authenticationService: AuthenticationService) {
  }

  public getUser(): any {
    return this.myHttp.get(this.profileUrl)
      .map((response) => response.json());
  }

  getToken(): Observable<any> {
    const data = {
      username: '',
      password: '',
      grant_type: 'password'
    };

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('username', data.username);
    urlSearchParams.set('password', data.password);
    urlSearchParams.set('grant_type', data.grant_type);
    // let body = urlSearchParams.toString()

    /**
     * $http.post('localhost:55828/token',
     'userName=' + encodeURIComponent(email) +
     '&password=' + encodeURIComponent(password) +
     '&grant_type=password',
     {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
     ).success(function (data) {//...
     */

    const postData = 'userName=' + encodeURIComponent(data.username) + '&password=' + encodeURIComponent(data.password) + '&grant_type=password';
    const headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    // headers.append('Access-Control-Allow-Origin', '*');
    const options = new RequestOptions({headers: headers}); // Create a request option

    return this.myHttp.post(this.authUrl, postData)
      .map((response) => response.json());
  }


  /**You are making a cross domain request.
   The request is to localhost:9000 and is made from localhost:9002.
   The browser creates a pre-flight request with the OPTIONS verb in order to know if he can continue and make the 'real' request. */


  getValue() {
    return this.myHttp.post(this.url, null)
      .map((response) => response.json());
  }

  updatePassword(user: ResetUser) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
    const options = new RequestOptions({headers: headers});

    const postData = 'oldPassword=' + encodeURIComponent(user.oldPassword)
      + '&newPassword=' + encodeURIComponent(user.newPassword)
      + '&confirmPassword=' + encodeURIComponent(user.confirmPassword);
    return this.http.post(this.userUrl + '/password', postData, options)
      .map((response) => response.json());
  }

}
