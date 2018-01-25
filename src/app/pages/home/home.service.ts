import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Constants} from "../../constants/app.constant";
import {AuthenticationService} from "../../services/authentication.service";
import {RatePair} from "../../models/rate-pair.model";
import {MyHttp} from "../../services/http.client.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import {TransactionSubmit} from "../../models/transactionSubmit.model";


@Injectable()
export class HomeService {
 // public url = Constants.RATE_API_ENDPOINT + 'v1/rate/real-time';
  public ratePairUrl = Constants.API_ENDPOINT + 'v1/rate/currency-pair';
  public customerRateUrl = Constants.API_ENDPOINT + 'v1/customer-currency-pair';
  public trxUrl = Constants.API_ENDPOINT + 'v1/transaction';
  public canTradeUrl = Constants.API_ENDPOINT + 'v1/sys-config/can-trade';

  public enableRealTimeRate = true;
  public space: Subject<RatePair[]> = new BehaviorSubject<RatePair[]>(null);
  public returnRatePair: RatePair;

  constructor(private http: MyHttp, public authenticationService: AuthenticationService) {
  }



  getCanTrade() {
    return this.http.get(this.canTradeUrl)
      .map((response) => response.json());
  }

  getCustomerRatePairs() {
    // get users from api
    return this.http.get(this.customerRateUrl)
      .map((response) => response.json());
  }

  removeCustomerRate(id: number) {
    return this.http.delete(this.customerRateUrl + '/' + id);
  }

  getRatePairs() {
    // get users from api
    return this.http.get(this.ratePairUrl)
      .map((response) => response.json());
  }

  saveCustomerRatePair(rate: RatePair) {
    return this.http.post(this.customerRateUrl, rate);
  }




  /**
   * -------- Real Time Rate END--------
   * */

  getCurrenyRatePair(pairs: RatePair[], buyCurrency: string, sellCurrency: string) {
    let returnRatePair: any;
    pairs.map(function (p) {
      if (p.buyCurrency === buyCurrency && p.sellCurrency === sellCurrency) {
        returnRatePair = JSON.parse(JSON.stringify(p));
        returnRatePair.isCurrencyReversed = false;
      } else if (p.buyCurrency === sellCurrency && p.sellCurrency === buyCurrency) {
        returnRatePair = JSON.parse(JSON.stringify(p));
        returnRatePair.isCurrencyReversed = true;
      }
    });
    return returnRatePair;
  };


  // ---------helper functions----------

  getCurrentOptions(pairs: RatePair[]) {
    let arr = [];
    pairs.map(function (pair) {
      arr.push(pair.buyCurrency);
      arr.push(pair.sellCurrency);
    });
    // debugger;
    return arr.filter(function (value, index) {
      return arr.indexOf(value) === index
    });
  }

  getSellOptionsByBuy(buyCurrency: string, currencyPairs: RatePair[]) {
    let sellCurrencyOptions = [];
    currencyPairs.map(function (pair) {
      // debugger;
      if (pair.buyCurrency === buyCurrency) {
        sellCurrencyOptions.push(pair.sellCurrency)
      }
      if (pair.sellCurrency === buyCurrency) {
        sellCurrencyOptions.push(pair.buyCurrency)
      }
    });
    return sellCurrencyOptions;
  };


  saveTransaction(trx: TransactionSubmit) {
    return this.http.post(this.trxUrl, trx)
      .map((response) => response.json())
      .catch(res => Observable.throw(res.json()));
  }
}
