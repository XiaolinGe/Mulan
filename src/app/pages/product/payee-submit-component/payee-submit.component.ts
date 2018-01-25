import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PayeeService} from '../../../services/payee.service';
import {Subject} from 'rxjs/Subject';
import {Trx} from '../../../models/trx.model';
import {BankAccount} from '../../../models/bank-account.model';
import {ToAddPayee} from '../../../models/submit-trx/toAdd.payee.model';
import {ToAddPayer} from '../../../models/submit-trx/toAdd.payer.model';
import {Changeability} from "../../../models/Changeability";
import {TrxService} from "../../../services/trx.service";
import {ToAddTrx} from "../../../models/submit-trx/toAdd.trx.model";

@Component({
  selector: 'payee-submit-component',
  templateUrl: 'payee-submit.component.html'
})
export class PayeeSubmitComponent implements OnInit {
  public bankAccounts: BankAccount[];
  public payees: ToAddPayee[];
  public bankAccount: BankAccount = new BankAccount();
  public payeeLoading: boolean;
  @Input('group')
  public payeeSubForm: FormGroup;

  @Input('payer')
  public payer: ToAddPayer;

  @Input('subject')
  public subject: Subject<ToAddPayer>;

  @Input('trx')
  public trx: ToAddTrx;

  @Input('payee')
  public payee: ToAddPayee = new ToAddPayee();
  public changeability: Changeability;
  public canEditAmount: boolean;

  constructor(public payeeService: PayeeService,
              public trxService: TrxService) {

  }

  ngOnInit(): void {
    console.log(this.payer);
    console.log(this.trx);
    console.log(this.payee);
    if (!this.payee) {
      this.payee = new ToAddPayee();
    }
    this.getPayeeList();
    this.subscribeParentEvent();

    if(this.trx && this.trx.parent && this.trx.parent.id > 0){
      this.canEditAmount = false;
    }else {
      this.canEditAmount = true;
    }

  }

  subscribeParentEvent() {
    this.subject.subscribe(event => {
      console.log(event);
      this.payer = event;
      this.getPayeeList();
    });
  }

  onPayeeChange(event) {
    console.log(event);
    this.getBankAccounts();
  }

  getPayeeList() {
    if (this.payer && this.payer.id > 0) {
      this.payeeLoading = true;
      this.payeeService.getPayeeByPayerId(this.payer.id).subscribe(resp => {
        this.payeeLoading = false;
        console.log(resp);
        this.payees = resp.content;
        // this.payee = this.payees[0];
        // this.onPayeeChange(null);
      }, err => {
        this.payeeLoading = false;
      });
    }
  }

  getBankAccounts() {
    if (this.payee && this.payee.id > 0 && this.trx) {
      this.payeeLoading = true;
      this.payeeService.getBankAccountsByPayeeId(this.payee.id, this.trx.buyCurrency).subscribe(resp => {
        this.payeeLoading = false;
        console.log(resp);
        this.bankAccounts = resp.content;
      }, err => {
        this.payeeLoading = false;
      });
    }
  }

  onBankAccountChange(event) {
    console.log(event);
  }

}
