import {Injectable, OnInit} from '@angular/core';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {Product} from '../models/product.model';
import {rendererTypeName} from "@angular/compiler";
import {Changeability} from "../models/Changeability";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import * as R from 'ramda';

@Injectable()
export class ProductService implements OnInit {


  public productUrl = Constants.API_ENDPOINT + 'v1/product';

  constructor(private http: MyHttp) {
  }

  ngOnInit(): void {

  }



  // updateProduct(id: number, product: SubmitProduct) {
  //   return this.http.put(`${this.productUrl}/${id}/split`, product).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  // }

  updateProduct(id: number, product: Product) {
    return this.http.put(`${this.productUrl}/${id}`, product).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getProduct(id: number) {
    return this.http.get(this.productUrl + '/' + id).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


  getAllByPaging(pageNumber: number, pageSize: number) {
   // const queryString = status.join('&f_status=');
    return this.http.get(this.productUrl /*+ '?page=' + pageNumber + '&size=' + pageSize*/ )
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }





}
