import {Injectable, OnInit} from '@angular/core';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {Payee} from "../models/payee.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PayeeService implements OnInit {


  public payeeUrl = Constants.API_ENDPOINT + 'v1/payee';

  constructor(private http: MyHttp) {
  }

  ngOnInit(): void {

  }

  disablePayee(payeeId: number, bool: boolean) {
    const data = {
      enable: bool
    };
    return this.http.patch(this.payeeUrl + '/' + payeeId, data).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getPayee(id: number): any {
    const embedded = "embedded=payee-bank-accounts,payer,attachments";
    return this.http.get(`${this.payeeUrl}/${id}?&${embedded}`).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getPayeeByPayerId(payerId: number) {
    return this.http.get(`${Constants.API_ENDPOINT}v1/payer/${payerId}/payee`).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  // http://api.ccfxtrader.com/v1/payee-bank-account?f_currency=NZD&f_currency_op=%3D&f_payee.id=137&f_payee.id_op=%3D
  getBankAccountsByPayeeId(payeeId: number, currency: string) {
    return this.http
      .get(`${Constants.API_ENDPOINT}v1/payee-bank-account?f_currency=${currency}&f_currency_op=%3D&f_payee.id=${payeeId}&f_payee.id_op=%3D`)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


  getTrx(id: number) {
    return this.http.get(`${this.payeeUrl}/${id}`).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


  getAllByPaging(pageNumber: number, pageSize: number, status: string[]) {
    const queryString = status.join('&f_status=');
    return this.http.get(`${this.payeeUrl}?page=${pageNumber}&size=${pageSize}&f_status=${queryString}`)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  // http://api.ccfxtrader.com/v1/payer/2/payee?page=1&size=12
  getAllByPagingAndPayerId(id: number, payeeName: string, pageNumber: number, pageSize: number, status: string[]) {
    let search = '';
    if (payeeName && payeeName !== undefined) {
      search = '&f_name=' + payeeName;
    } else {
      search = '';
    }
    const queryString = status.join('&f_status=');
    const embedded = "embedded=payer";
    return this.http.get(`${Constants.API_ENDPOINT}v1/payer/${id}/payee?${embedded}&page=${pageNumber}&size=${pageSize}${search}`)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  // url: API.url + 'v1/payer/:payerId/payee',
  addPayee(payerId: number, value: Payee) {
    return this.http.post(`${Constants.API_ENDPOINT}v1/payer/${payerId}/payee`, value)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  // url: API.url + 'v1/payer/:payerId/payee',
  updatePayee(payeeId: number, value: Payee) {
    return this.http.put(`${this.payeeUrl}/${payeeId}`, value).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

}
