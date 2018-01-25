import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {PayerSubmit} from '../models/payer.submit.model';
import {Observable} from "rxjs/Observable";


@Injectable()
export class PayerService {
  public token: string;
  public countryUrl = Constants.API_ENDPOINT + 'v1/country';
  public currencyUrl = Constants.API_ENDPOINT + 'v1/payee-bank-account/currency';
  public payerUrl = Constants.API_ENDPOINT + 'v1/payer';
  public codeTypeUrl = Constants.API_ENDPOINT + 'v1/payee-bank-account/code-types';


  constructor(private http: MyHttp) {
  }

  getCountries() {
    return this.http.get(this.countryUrl)
      .map((response) => response.json());
  }

  addPayer(payer: PayerSubmit) {
    return this.http.post(this.payerUrl, payer).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getPayers(): any {
    return this.http.get(this.payerUrl).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getAllByPaging(pageNumber: number, pageSize: number) {
    return this.http.get(this.payerUrl + '?page=' + pageNumber + '&size=' + pageSize)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getCurrencies() {
    return this.http.get(this.currencyUrl)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getCodeTypes() {
    return this.http.get(this.codeTypeUrl)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }
}
