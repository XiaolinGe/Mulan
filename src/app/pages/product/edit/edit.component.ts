import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeService} from '../../home/home.service';
import {TrxService} from '../../../services/trx.service';
import {Trx} from '../../../models/trx.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SubmitTrx} from '../../../models/submit-trx/submit.trx.model';
import {ToAddTrx} from '../../../models/submit-trx/toAdd.trx.model';
import {debug} from "util";
import {Changeability} from "../../../models/Changeability";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'mrp-edit-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: []
})
export class TrxEditComponent implements OnInit {
  public parentTrx: SubmitTrx;
  public parentTrxId: number;
  public receivedTrx: SubmitTrx; // 服务器返回的Trx
  public trxId: number;
  public myForm: FormGroup;
  public submitTrx: SubmitTrx = new SubmitTrx(); // 本地得到的数据
  public toAddTrx: ToAddTrx; //要提交的数据
  public changeability: Changeability;

  public loading: boolean;

  constructor(public  homeService: HomeService,
              private _fb: FormBuilder,
              public router: Router,
              public trxService: TrxService,
              public toastrService: ToastrService,
              private activatedRoute: ActivatedRoute) {

    this.getTrxId();
  }

  ngOnInit() {

    this.initTrxFormControl();
  }

  getTrx() {
    this.loading = true;
    this.trxService.getTrx(this.trxId).subscribe(resp => {
      this.loading = false;

      this.receivedTrx = resp;
      console.log(this.receivedTrx);
      this.parentTrxId = this.trxService.getOriginalTrxId(this.receivedTrx);
      if (this.parentTrxId) {
        this.trxService.getTrx(this.parentTrxId).subscribe(resp => {
          this.parentTrx = resp;
          console.log(resp);
        });
      }

      this.changeability = this.trxService.getTrxChangeability(this.receivedTrx);
      console.log(this.changeability);

      if (this.changeability.isParent) {
        this.router.navigate(['/pages/trx/list']);
      }

      this.toAddTrx = this.trxService.TransferToAddTrx(this.receivedTrx);

      console.log(this.toAddTrx);
      this.loadPayerForm();

    }, err => {
      this.loading = false;
    });
  }

  loadPayerForm(): any {
    const trxFormCtrls = (<FormArray>this.myForm.controls['payers']).controls;
    while (trxFormCtrls.length < this.toAddTrx.children.length) {
      this.addPayerFormControl();
    }
  }

  getTrxId() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.trxId = params['id'];
      this.getTrx();
    });
  }

  initTrxFormControl() {
    this.myForm = this._fb.group({
      payers: this._fb.array([])
    });
  }

  getPayerFormData() {
    return <FormArray>this.myForm.get('payers');
  }

  getChildTrx(i: number) {
    if (this.toAddTrx && this.toAddTrx.children) {
      return this.toAddTrx.children[i];
    }
  }

  initPayerFormControl() {
    return this._fb.group({
      id: ['', Validators.required],
      // payerName: ['', Validators.required],
      payees: this._fb.array([])
    });
  }

  removePayerFormControl(i: number) {
    const control = <FormArray> this.myForm.controls['payers'];
    control.removeAt(i);
  }

  addPayerFormControl() {
    const control = <FormArray>this.myForm.controls['payers'];
    const addrCtrl = this.initPayerFormControl();
    control.push(addrCtrl);
  }

  // initPayeeFormControl() {
  //   return this._fb.group({
  //     id: ['', Validators.required],
  //     payeeBankAccountId: ['', Validators.required],
  //     payeeName: ['', Validators.required],
  //     bankAccount: ['', Validators.required],
  //     payAmount: ['', Validators.required],
  //     paymentReason: ['', Validators.required]
  //   });
  // }
  //
  // addPayeeFormControl(payerFormControl: FormControl) {
  //   const control = <FormArray>payerFormControl['payees'];
  //   const addrCtrl = this.initPayeeFormControl();
  //   control.push(addrCtrl);
  // }
  //
  // removePayeeFormControl(payerFormControl: FormControl, i: number) {
  //   const control = <FormArray>payerFormControl['payees'];
  //   control.removeAt(i);
  // }


  onSubmit({value, valid}: { value: ToAddTrx, valid: boolean }) {

    value.id = this.receivedTrx.id;

    console.log(value);
    this.submitTrx = this.trxService.TransferTrxToSubmit(value);
    console.log(this.submitTrx);

    if (this.changeability.dividable) {
      this.trxService.submitTrx(this.receivedTrx.id, this.submitTrx).subscribe(resp => {
        console.log(resp);
        this.router.navigate(['pages/trx/confirm-deal/' + this.receivedTrx.id]);
      }, err => {
        console.log(err);
        this.toastrService.error(err.error);
      });
    } else if (!this.changeability.dividable && this.changeability.editable) {
      this.trxService.updateTrx(this.receivedTrx.id, this.submitTrx.children[0]).subscribe(resp => {
        console.log(resp);
        this.router.navigate(['pages/trx/list']);
      }, err => {
        console.log(err);
        this.toastrService.error(err.error);
      });
    }
  }
}
