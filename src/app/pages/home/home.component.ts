import {Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {HomeService} from './home.service';
import {Rate} from '../../models/rate.model';
import {RatePair} from '../../models/rate-pair.model';
import {SelectedRateCurrencyData} from '../../models/selected-rate-currency-data.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HelperService} from '../../services/helper.service';
import {TwoDecimalPipe} from '../../theme/pipes/decimalPipe/two-decimal.pipe';
import {FourDecimalPipe} from '../../theme/pipes/decimalPipe/four-decimal.pipe';
import {Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {User} from "../../models/user.model";
import {CustomerRatePair} from "../../models/customer-rate-pair.model";
import {TransactionSubmit} from "../../models/transactionSubmit.model";
import {Trx} from "../../models/trx.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs/Subscription";
import {AutoUnsubscribe} from "ngx-auto-unsubscribe";
@AutoUnsubscribe()
@Component({
  selector: 'mrp-home',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TwoDecimalPipe, FourDecimalPipe]
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('addFxRateModal') addFxRateModal: any;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;


  // https://stackoverflow.com/questions/40458739/two-way-binding-in-reactive-forms
  // form two way biding
  public rate: Rate;
  public rates: Rate[];
  public ratePairs: RatePair[];
  public selectedRateCurrencyData: SelectedRateCurrencyData;
  public selectedBuyCurrency: string;
  public selectedBuyAmount: number;
  public selectedSellCurrency: string;
  public selectedSellAmount: number;
  public selectedRate: number;
  public buyCurrencyOptions: string[];
  public sellCurrencyOptions: string[];

  public currentRatePair: RatePair;

  public isBuy: boolean;

  public user: User;

  public myForm: FormGroup;
  public addFxRateForm: FormGroup;

  public tempCustomerRatePairs: CustomerRatePair[];
  public customerRatePairs: RatePair[];
  public cutomerCurrencyPair: RatePair;
  public cutomerCurrencyPairOptions: RatePair[];
  public selectedCustomerRatePair: CustomerRatePair;

  public trx: Trx;
  public trxSubmit: TransactionSubmit = new TransactionSubmit();
  public canTrade: boolean;

  public enableAcceptBtn = true;

  public canTradeSub: Subscription;
  private ratePairsSub: Subscription;
  private realTimeRateSub: Subscription;
  private getRatePairsSub: Subscription;

  constructor(public homeService: HomeService,
              public accountService: AccountService,
              public authService: AuthenticationService,
              private _fb: FormBuilder,
              public ref: ChangeDetectorRef,
              public helperService: HelperService,
              public router: Router,
              public toastrService: ToastrService,
              private twoDecimalPipe: TwoDecimalPipe) {

    this.isBuy = true;
    this.trxSubmit.isCalculateFromBuyToSell = true;
    this.selectedRate = 0.0008;


    this.subscribeRate();

  }

  ngOnInit(): void {

    this.initForm();


    this.getCustomerRateList();

    this.getUserInfo();

    this.getRatePairs();


    this.getCanTrade();

  };

  initForm() {
    this.myForm = this._fb.group({
      selectedBuyCurrency: ['', [Validators.required]],
      selectedBuyAmount: ['', [Validators.required]],
      selectedSellCurrency: ['', [Validators.required]],
      selectedSellAmount: ['', [Validators.required]]
    });

    this.addFxRateForm = this._fb.group(
      {
        cutomerCurrencyPair: ['', [Validators.required]]
      }
    )
  }


  getCanTrade() {
    this.canTradeSub = this.homeService.getCanTrade().subscribe(resp => {
      // console.log(resp);
      this.canTrade = resp.canTrade;
    });
  }

  subscribeRate() {
    this.ratePairsSub = this.homeService.space.subscribe((val) => {
      // // console.log(val);
      this.ratePairs = val;
      if (this.ratePairs && this.ratePairs.length > 0 && this.selectedBuyCurrency && this.selectedSellCurrency) {
        this.currentRatePair = this.homeService.getCurrenyRatePair(this.ratePairs, this.selectedBuyCurrency, this.selectedSellCurrency);
        console.log(this.currentRatePair);
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
      this.onAmountChange();
      // ------- get real time customer rate subscription list BEGIN ----
      // https://segmentfault.com/q/1010000009864264
      if (this.ratePairs && this.ratePairs.length > 0) {
        if (this.tempCustomerRatePairs && this.tempCustomerRatePairs.length > 0) {
          let temp = [];
          // this.tempCustomerRatePairs.map(function (rate) {
          for (var i = 0; i < this.tempCustomerRatePairs.length; i++) {

            let tempBuyPrice = this.homeService.getCurrenyRatePair(this.ratePairs, this.tempCustomerRatePairs[i].buyCurrency, this.tempCustomerRatePairs[i].sellCurrency).buyPrice;
            let tempSellPrice = this.homeService.getCurrenyRatePair(this.ratePairs, this.tempCustomerRatePairs[i].buyCurrency, this.tempCustomerRatePairs[i].sellCurrency).sellPrice;
            temp.push({
              'id': this.tempCustomerRatePairs[i].id,
              'buyCurrency': this.tempCustomerRatePairs[i].buyCurrency,
              'sellCurrency': this.tempCustomerRatePairs[i].sellCurrency,
              'buyPrice': tempBuyPrice,
              'sellPrice': tempSellPrice
            });
          }
          this.customerRatePairs = temp;
        } else {
          this.customerRatePairs = [];
        }
      }
      // ------- get real time customer rate subscription list END ------

    });
  }


  getRatePairs() {
    this.getRatePairsSub =  this.homeService.getRatePairs().subscribe(resp => {
      this.ratePairs = resp;
      this.cutomerCurrencyPairOptions = resp;
      // console.log(this.ratePairs);
      this.buyCurrencyOptions = this.homeService.getCurrentOptions(this.ratePairs);
      // this.selectedRateCurrencyData.buyCurrency = this.buyRateOptions[0].buyCurrency;
      // this.selectedBuyCurrency = 'NZD';
      // this.selectedBuyAmount = parseFloat(this.twoDecimalPipe.transform('1', 2));
      this.sellCurrencyOptions = this.homeService.getSellOptionsByBuy(this.selectedBuyCurrency, this.ratePairs);
      // this.selectedSellCurrency = 'USD';
      this.updateForm();
      this.onBuyCurrencyChanged();
    });
  }

  getUserInfo() {
    this.accountService.getUser().subscribe(resp => {
      this.user = resp;
    });
    // console.log(this.user);
  }

  updateForm(): any {
    this.myForm.patchValue({
      selectedBuyCurrency: this.selectedBuyCurrency,
      selectedBuyAmount: this.selectedBuyAmount,
      selectedSellCurrency: this.selectedSellCurrency,
      selectedSellAmount: this.selectedSellAmount,
    });
  }


  print() {
    console.log(this.currentRatePair);
  }

  onBuyCurrencyChanged() {
    // console.log(this.selectedBuyCurrency);
    this.sellCurrencyOptions = this.homeService.getSellOptionsByBuy(this.selectedBuyCurrency, this.ratePairs);
    this.selectedSellCurrency = this.sellCurrencyOptions[0];
    this.onAmountChange();
  }

  onBuyAmountClick() {
    this.isBuy = true;
    this.trxSubmit.isCalculateFromBuyToSell = true;
  }

  onSellAmountClick() {
    this.isBuy = false;
    this.trxSubmit.isCalculateFromBuyToSell = false;
  }


  onBuyAmountChanged(event) {
    // console.log(event);
    this.isBuy = true;
    this.trxSubmit.isCalculateFromBuyToSell = true;
    // console.log(this.selectedBuyCurrency);

    this.onAmountChange();
  }

  onSellCurrencyChanged() {
    // console.log(this.selectedBuyCurrency);
    this.onAmountChange();
  }

  onSellAmountChanged() {
    this.isBuy = false;
    this.trxSubmit.isCalculateFromBuyToSell = false;
    console.log(this.isBuy);
    this.onAmountChange();
  }

  onAmountChange() {
    console.log(this.currentRatePair);
    let rate;
    if (this.currentRatePair && !this.currentRatePair.isCurrencyReversed) {
      rate = this.currentRatePair.buyPrice;
    } else if (this.currentRatePair && this.currentRatePair.isCurrencyReversed) {
      rate = 1 / this.currentRatePair.sellPrice;
    }

    console.log(rate);
    // if (this.isBuy) {
    //   this.selectedSellAmount = this.selectedBuyAmount * this.selectedRate;
    // } else {
    //   this.selectedBuyAmount = this.selectedSellAmount / this.selectedRate;
    // }
    // this.updateForm();
    // debugger;
    // console.log(rate);

    if (this.isBuy && this.selectedBuyAmount > 0) {
      this.selectedSellAmount = this.helperService.parseToFix(this.selectedBuyAmount * rate, 2);
      this.selectedBuyAmount = this.helperService.parseToFix(this.selectedBuyAmount, 2);
    } else if (this.selectedSellAmount > 0) {
      this.selectedBuyAmount = this.helperService.parseToFix(this.selectedSellAmount / rate, 2);
      this.selectedSellAmount = this.helperService.parseToFix(this.selectedSellAmount, 2);
    }
    // this.updateForm();
  }


  onRateChange() {

  }

  /**
   * ------- Get customer booked rate list----------
   * */

  confirmDelete(rate: CustomerRatePair) {
    this.selectedCustomerRatePair = rate;
    this.confirmDeleteModal.open();
  }

  getCustomerRateList() {
    this.homeService.getCustomerRatePairs().subscribe(resp => {
      this.tempCustomerRatePairs = resp.content;
      this.ref.markForCheck();
      this.ref.detectChanges();
      console.log(resp);
    });
  }

  removeCustomerRate() {
    this.homeService.removeCustomerRate(this.selectedCustomerRatePair.id).subscribe(resp => {
      this.getCustomerRateList();
      this.confirmDeleteModal.close();
    }, err => {
      this.getCustomerRateList();
    });
  }

  onAddFxRateFormSubmit(value) {
    this.homeService.saveCustomerRatePair(this.cutomerCurrencyPair).subscribe(resp => {
      this.getCustomerRateList();
      this.addFxRateModal.close()
    });
  }

  onSubmit(value) {
    // console.log(value);
    this.router.navigate(['/pages/trx/add']);
  }

  createTrx() {

    this.trxSubmit.buyCurrency = this.selectedBuyCurrency;
    this.trxSubmit.buyAmount = this.selectedBuyAmount;
    this.trxSubmit.sellCurrency = this.selectedSellCurrency;
    this.trxSubmit.sellAmount = this.selectedSellAmount;
    this.trxSubmit.type = 'SPOT';
    this.enableAcceptBtn = false;
    this.homeService.saveTransaction(this.trxSubmit).subscribe(resp => {
      // console.log(resp);
      this.trx = resp;
      this.enableAcceptBtn = true;
      this.router.navigate(['/pages/trx/confirm/' + this.trx.id]);
    }, err => {
      this.toastrService.error(err.error);
      this.enableAcceptBtn = true;
    });
  }

  ngOnDestroy(): void {
    //this.homeService.stopRealtimeRateByRecursion();
    // this.canTradeSub.unsubscribe();
    // this.ratePairsSub.unsubscribe();
    // this.realTimeRateSub.unsubscribe();
    // this.getRatePairsSub.unsubscribe();
  }
}

