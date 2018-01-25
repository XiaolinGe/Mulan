import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PayerService} from '../../../services/payer.service';
import {Subject} from 'rxjs/Subject';
import {Trx} from '../../../models/trx.model';
import {ToAddPayer} from '../../../models/submit-trx/toAdd.payer.model';
import {ToAddTrx} from "../../../models/submit-trx/toAdd.trx.model";
import {TrxChild} from "../../../models/submit-trx/child.trx.model";
import {Payer} from "../../../models/payer.model";
import {ToAddPayee} from "../../../models/submit-trx/toAdd.payee.model";
import {Changeability} from "../../../models/Changeability";
import {TrxService} from "../../../services/trx.service";

@Component({
  selector: 'payer-submit-component',
  templateUrl: 'payer-submit.component.html'
})
export class PayerSubmitComponent implements OnInit {
  @Input('group')
  public payerForm: FormGroup;

  @Input('trx')
  public trx: ToAddTrx;


  @Input('trxChild')
  public trxChild: TrxChild;

  public payerLoading: boolean;
  public payees: ToAddPayee[];
  public payers: Payer[];
  public payer: Payer = new Payer();
  public payerSubject: Subject<Payer> = new Subject();
  public changeability: Changeability;
  public payerId: number;

  constructor(private _fb: FormBuilder,
              public payerService: PayerService,
              public trxService: TrxService) {

  }

  ngOnInit(): void {
    this.loadPayer();
    this.getPayerList();
    this.initPayeeFormControl();
    this.getChangeability();
  }

  getChangeability() {
    if (this.trx) {
      this.changeability = this.trxService.getTrxChangeability(this.trx);
      console.log(this.changeability);
    }
  }

  loadPayer() {
    console.log(this.trx);
    console.log(this.trxChild);
    if (this.trxChild && this.trxChild.payer) {
      this.payer = this.trxChild.payer;
      this.payerId = this.payer.id;
      this.payees = this.trxChild.payees;
      const control = <FormArray>this.payerForm.controls['payees'];
      if (control.length < this.payees.length) {
        this.addPayeeFormControl();
      }
    } else {
      this.addPayeeFormControl();
    }
  }

  getPayee(i) {
    if (this.trxChild && this.trxChild.payees) {
      return this.trxChild.payees[i];
    } else {
      const newToAddPayee = new ToAddPayee();
      return newToAddPayee;
    }
  }

  getPayeeFormData() {
    return <FormArray>this.payerForm.get('payees');
  }

  initPayeeFormControl() {
    return this._fb.group({
      id: ['', Validators.required],
      payeeBankAccountId: ['', Validators.required],
      // payeeName: ['', Validators.required],
      // bankAccount: ['', Validators.required],
      payAmount: ['', Validators.required],
      paymentReason: [''],
      sameday: ['']
    });
  }

  removePayeeFormControl(i: number) {
    const control = <FormArray> this.payerForm.controls['payees'];
    control.removeAt(i);
  }

  addPayeeFormControl() {
    const control = <FormArray>this.payerForm.controls['payees'];
    const addrCtrl = this.initPayeeFormControl();
    control.push(addrCtrl);
  }

  getPayerList() {
    this.payerLoading = true;
    this.payerService.getAllByPaging(1, 10000).subscribe(resp => {
      this.payerLoading = false;

      this.payers = resp.content;
      this.onPayerChange();
      this.payerSubject.next(this.payer);

      console.log(resp);
    }, err => {
      this.payerLoading = false;
    })
  }

  onPayerChange() {
    console.log(this.payerId);
    if (this.payers && this.payers.length > 0) {
      this.payer = this.payers.find(d => d.id === this.payerId);
      console.log(this.payer);
      this.payerSubject.next(this.payer);
    }
  }

  onBankAccountChange(event) {
    console.log(event);
  }

  myPayerSelected($event) {
    console.log($event);
    if ($event) {
      this.payer = $event;
      this.payerId = this.payer.id;
      this.payerSubject.next(this.payer);
    }
  }

}
