import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {AuthenticationService} from "./authentication.service";


// https://stackoverflow.com/questions/34464108/angular2-set-headers-for-every-request
@Injectable()
export class MyHttp {

  constructor(private http: Http, private authenticationService: AuthenticationService) {
  }

  createAuthorizationHeader(headers: Headers) {
    // let headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
    // let options = new RequestOptions({headers: headers});
    if (this.authenticationService.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    }
    // headers.append('token', this.authenticationService.token);
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  put(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.put(url, data, {
      headers: headers
    });
  }

  patch(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.patch(url, data, {
      headers: headers
    });
  }

  delete(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.delete(url, {
      headers: headers
    });
  }

}
