import {Injectable, OnInit} from '@angular/core';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class CategoryService implements OnInit {


  public categoryUrl = Constants.API_ENDPOINT + 'v1/category';

  constructor(private http: MyHttp) {
  }

  ngOnInit(): void {

  }


  getCategory(id: number) {
    return this.http.get(this.categoryUrl + '/' + id).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


  getAll() {
    return this.http.get(this.categoryUrl)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


}
