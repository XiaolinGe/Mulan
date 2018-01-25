import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PayerService} from '../../../services/payer.service';
import {CodeType} from '../../../models/code-type.model';
import * as R from 'ramda';
import {BankAccount} from "../../../models/bank-account.model";

@Component({
  selector: 'payee-bank-account-component',
  templateUrl: 'payee-bank-account.component.html',
  styleUrls: ['payee-bank-account.component.scss']
})
export class PayeeBankAccountComponent implements OnInit {
  public uniqueCodes: CodeType[];
  public selectedCode: CodeType;
  public codes: CodeType[];
  public countries: string[];
  public clearingCodeType: string;
  public currency: string;
  public accountCountry: string;

  @Input('group')
  public payeeBankAccountForm: FormGroup;

  @Input('bankAccount')
  public bankAccount: BankAccount;

  constructor(public payerService: PayerService) {
  }

  ngOnInit(): void {
    this.getCodeTypes();
    this.getCountryList();
    console.log(this.bankAccount);
    if (!this.bankAccount) {
      this.bankAccount = new BankAccount();
    }
  }

  getCountryList() {
    this.payerService.getCountries().subscribe(resp => {
      console.log(resp);
      this.countries = resp;
      // this.country = this.countries[0];
    });
  }

  getCodeTypes() {
    this.payerService.getCodeTypes().subscribe(resp => {
        console.log(resp);
        this.codes = resp;
        this.uniqueCodes = this.codes.filter(
          (ele, index, array) =>
            index === array.findIndex(element2 => element2.currency === ele.currency)
        )
      }
    )
  }

  onCurrencyChange(event) {
    console.log(event);
    this.currency = event;
    this.onCodeChange();
  }

  onAccountCountryChange(event) {
    console.log(event);
    this.accountCountry = event;
    this.onCodeChange();
  }

  onCodeChange() {

    // if (this.codes) {
    //   this.selectedCode = R.find(R.propEq('currency', this.currency) && R.propEq('name', this.accountCountry))(this.codes);
    // }
    if (this.codes && this.codes.length > 0) {
      this.selectedCode = this.codes.find((ele, index, array) =>
        ele.currency === this.currency && ele.name === this.accountCountry
      );
    }
    if (this.selectedCode) {
      this.clearingCodeType = this.selectedCode.clearingCodeType;
    }
    console.log(this.selectedCode);
  }

// currency
// accountName: '',
// accountNumber: '',
// accountCountry: '',
// bankName: '',
// branchName: '',
// branchAddress: '',
// clearingCode: '',
// clearingCodeType: ''


}
