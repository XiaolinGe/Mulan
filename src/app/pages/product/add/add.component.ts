import {FormGroup} from '@angular/forms/forms';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators, FormArray} from '@angular/forms';
import {Router} from '@angular/router';
import {BeneficiaryService} from '../../../services/beneficiary.service';
import {Payer} from '../../../models/payer.model';
import {Payee} from '../../../models/payee.model';
import {HomeService} from '../../home/home.service';
import {RatePair} from '../../../models/rate-pair.model';
import {BankAccount} from '../../../models/bank-account.model';
import {Constants} from '../../../constants/app.constant';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'mrp-add-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: []
})
export class TrxAddComponent implements OnInit {
  public payers: Payer[];
  public payer: Payer;
  public payees: Payee[];

  public ratePairs: RatePair[];
  public buyRateOptions: RatePair[];
  public sellRateOptions: RatePair[];

  public bankAccountOptions: BankAccount[];
  public selectedBuyCurrency: string;
  public selectedBuyAmount: number;
  public selectedSellCurrency: string;
  public selectedSellAmount: number;
  public selectedRate: number;


  public selectedPayeeId: number;
  public selectedBankAccountId: number;
  public myForm: FormGroup;
  public isCollapsed = true;
  public dropZoneFiles: any = [{id: 1, name: 'Filename', originalFilename: 'Filename', size: 12345}, {
    id: 2,
    name: 'NewFile',
    originalFilename: 'NewFile',
    size: 111111
  }];
  public fileUploadUrl = Constants.API_ENDPOINT + 'file';
  public config: any;

  constructor(private _fb: FormBuilder,
              public beneficiaryService: BeneficiaryService,
              public router: Router,
              public homeService: HomeService,
              public authenticationService: AuthenticationService) {

    beneficiaryService.getPayerList().subscribe(resp => {
      console.log(resp);
      this.payer = resp.content[0];
      this.getPayeeList(this.payer.id);
    });

    this.config = {
      headers: {'Authorization': 'Bearer ' + this.authenticationService.token},
      addRemoveLinks: true,
      clickable: true
    };

    homeService.getRatePairs().subscribe(resp => {
      this.ratePairs = resp;
      console.log(this.ratePairs);
      this.buyRateOptions = homeService.getCurrentOptions(this.ratePairs);
      // this.selectedRateCurrencyData.buyCurrency = this.buyRateOptions[0].buyCurrency;
      this.selectedBuyCurrency = 'NZD';
      this.sellRateOptions = homeService.getSellOptionsByBuy(this.selectedBuyCurrency, this.ratePairs);
      this.selectedSellCurrency = 'USD';
    });
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      buyCurrency: ['', [Validators.required]],
      buyAmount: ['', [Validators.required]],
      sellCurrency: ['', [Validators.required]],
      sellAmount: ['', [Validators.required]],
      rate: ['0.08', [Validators.required]],
      payeeId: ['', [Validators.required]],
      bankAccountId: ['', [Validators.required]],
      bankAccounts: this._fb.array([])
    });

    // add address
    // this.addbankAccount();
    /* subscribe to addresses value changes */
    // this.myForm.controls['addresses'].valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  onUploadError(event) {
    console.log(event);
  }

  onUploadSuccess(event) {
    console.log(event);
  }
  onBuyCurrencyChanged() {
    this.getBankAccounts(this.selectedPayeeId, this.selectedBuyCurrency);
  }

  onPayeeChanged() {
    console.log(this.selectedPayeeId);
    this.getBankAccounts(this.selectedPayeeId, this.selectedBuyCurrency);
  }


  onBankAccountChanged(event) {
    console.log('bank account changed');
    console.log(event);
    if (event === '0') {
      console.log('add new bank account');
      this.removeBankAccount(0);
    } else if (event === '-1') {
      console.log('add new bank account');
      this.addbankAccount();
    }

  }

  getPayeeList(id: number) {
    this.beneficiaryService.getPayeeList(id).subscribe(resp => {
      console.log(resp);
      this.payees = resp.content;
      this.selectedPayeeId = this.payees[0].id;
      this.getBankAccounts(this.selectedPayeeId, 'NZD');
    });
  }

  addNewBankAccount() {
    console.log('add new bank account');
  }

  getBankAccounts(payeeId: number, currency: string) {
    this.beneficiaryService.getBankAccountsByPayeeIdAndCurrency(payeeId, currency).subscribe(resp => {
      console.log(resp);
      this.bankAccountOptions = resp.content;
    });
  }

  dropZoneOutput(event) {
    console.log('dropZoneOutput');
    console.log(event);
  }

  initBankAccount() {
    return this._fb.group({
      currency: ['', Validators.required],
      country: [''],
      accountName: [''],
      accountNumber: [''],
      bankName: [''],
      bankBranch: [''],
      swiftCode: [''],
      branchAddress: [''],
      beneficiaryAddress: [''],
      bankCodeType: [''],
      bankCode: ['']
    });
  }

  addbankAccount() {
    const control = <FormArray>this.myForm.controls['bankAccounts'];
    const addrCtrl = this.initBankAccount();
    control.push(addrCtrl);
  }

  getFormData() {
    return <FormArray>this.myForm.get('bankAccounts');
  }

  removeBankAccount(i: number) {
    const control = <FormArray> this.myForm.controls['bankAccounts'];
    control.removeAt(i);
  }

  onSubmit({value, valid}: { value: any, valid: boolean }) {
    console.log(value, valid);
    // this.beneficiaryService.add(value).subscribe(resp => {
    //   console.log(resp);
    //   this.router.navigate(['pages/beneficiary/all']);
    // });
  }
}
