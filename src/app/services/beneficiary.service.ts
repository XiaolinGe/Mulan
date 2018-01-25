import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Constants} from '../constants/app.constant';
import {MyHttp} from "./http.client.service";


@Injectable()
export class BeneficiaryService {
  public token: string;
  public url = Constants.API_ENDPOINT + 'beneficiary';
  private payerId: number;
  public payerApiUrl = Constants.API_ENDPOINT + 'v1/payer';
  public payeeApiUrl = Constants.API_ENDPOINT + 'v1/payer';
  public bankAccountUrl = Constants.API_ENDPOINT + 'v1/payee-bank-account';

  constructor(private http: MyHttp) {
    // this.getAdministrators().subscribe(resp => {
    //     console.log(resp);
    // })
  }

  getAll() {
    // get users from api
    return this.http.get(this.url)
      .map((response) => response.json());
  }

  getPayerList() {
    // get users from api
    return this.http.get(this.payerApiUrl)
      .map((response) => response.json());
  }

  getPayer(id: number) {
    return this.http.get(this.payerApiUrl + '/' + id)
      .map((response) => response.json());
  }

  getPayeeList(id) {
    return this.http.get(this.payeeApiUrl + '/' + id + '/payee')
      .map((response) => response.json());
  }


  getBankAccountsByPayeeIdAndCurrency(payeeId: number, currency: string) {

    return this.http.get(this.bankAccountUrl + '?f_payee.id=' + payeeId + '&f_payee.id_op==&f_currency=' + currency + '&f_currency_op==')
      .map((response) => response.json());
  }

}
