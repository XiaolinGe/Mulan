import {Injectable, OnInit} from '@angular/core';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {Observable} from 'rxjs/Observable';
import {Balance} from '../models/balance.model';
import * as moment from 'moment-timezone';

@Injectable()
export class BalanceService implements OnInit {


  public balanceUrl = Constants.API_ENDPOINT + 'v1/balance';
  public today: any;

  constructor(private http: MyHttp) {
    this.today = moment().tz('Pacific/Auckland').format('YYYY-MM-DD');
    console.log(this.today);
  }

  ngOnInit(): void {

  }

  // http://localhost:9999/v1/balance?f_settleDate=1999-10-13&f_settleDate_op==
  getAllByPaging(pageNumber: number, pageSize: number, searchCondition: string) {
    const dateString = '&f_settleDate=' + this.today + '&f_settleDate_op==';
    const embedded = '&embedded=balance-incomings,balance-settlements';
    return this.http.get(`${this.balanceUrl}?&page=${pageNumber}&size=${pageSize}${embedded + searchCondition}`)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  // http://api.ccfxtrader.com/v1/payer/2/payee?page=1&size=12
  getAllByPagingForAdmin(userId: number, pageNumber: number, pageSize: number) {
    const embedded = '&embedded=balance-incomings,balance-settlements';
    return this.http.get(`${this.balanceUrl}?f_user.id=${userId}&f_user.id_op==&page=${pageNumber}&size=${pageSize}`)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  get(id: number): any {
    const embedded = '?embedded=balance-incomings,balance-settlements';
    return this.http.get(this.balanceUrl + '/' + id + embedded)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  addBalanceForAdmin(balance: Balance) {
    return this.http.post(this.balanceUrl, balance)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  updateBalanceForAdmin(id: number, balance: Balance) {
    return this.http.put(this.balanceUrl + '/' + id, balance)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


}
