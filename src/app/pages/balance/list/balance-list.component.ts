import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TrxService} from "../../../services/trx.service";
import {Trx} from "../../../models/trx.model";
import {Constants} from "../../../constants/app.constant";
import {BalanceService} from "../../../services/balance.service";
import {Balance} from "../../../models/balance.model";
import {HelperService} from "../../../services/helper.service";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'mrp-balance-list-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.scss'],
  providers: []
})
export class BalanceListComponent implements OnInit {
  balances: Balance[];
  transactions: Trx[];
  public pageNumber: number;
  public pageSize: number;
  public totalSize: number;

  public fromTime: any;
  public toTime: any;
  public searchCondition: string;
  public searchForm: FormGroup;
  public loading: boolean;


  constructor(public balanceService: BalanceService,
              public formBuilder: FormBuilder,
              public helperService: HelperService) {
    this.pageNumber = 1;
    this.pageSize = 12;
    this.searchCondition = '';
  }

  ngOnInit(): void {
    this.refresh();
    this.buildSearchFrom();
    this.debounceSearchForm();
  }

  refresh() {
    this.loading = true;
    this.balanceService.getAllByPaging(this.pageNumber, this.pageSize, this.searchCondition).subscribe((resp) => {
      console.log(resp);
      this.balances = resp.content;
      this.totalSize = resp.totalElements;
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.refresh();
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.refresh();
  }

  search() {
    // console.log(this.fromTime);
    // console.log(this.toTime);
    // if (!this.fromTime) {
    //   this.fromTime = '1970-01-01';
    // }
    // if (!this.toTime) {
    //   this.toTime = '2200-01-01';
    // }
    //
    // if (this.fromTime === this.toTime) {
    //   this.searchCondition = '&f_settleDate=' + this.fromTime;
    // } else {
    //   this.searchCondition = '&f_settleDate=' + this.fromTime + '&f_settleDate=' + this.toTime;
    // }

    this.refresh()

  }

  /**
   * ----- search form -----
   */
  buildSearchFrom() {
    this.searchForm = this.formBuilder.group({
      fromTime: [''],
      toTime: ['']
    });
  }

  debounceSearchForm() {
    this.searchCondition = '';
    this.searchForm.valueChanges.debounceTime(500).subscribe((form: any) => {
        if (form) {

          console.log(form);

          // if (!form.fromTime) {
          //   form.fromTime = '1970-01-01';
          // }
          // if (!form.toTime) {
          //   form.toTime = '2200-01-01';
          // }
          //
          // if (form.fromTime === form.toTime) {
          //   form.toTime = '';
          // }

          this.searchCondition = this.helperService.generateQueryString(form);
          console.log(this.searchCondition);

          this.searchCondition = this.searchCondition.replace('&f_fromTime', '&f_settleDate_op==&f_settleDate');
          // this.searchCondition = this.searchCondition.replace('&f_toTime', '&f_settleDate');

          let td = new Date();
          let dd: any = td.getDate();
          let mm: any = td.getMonth() + 1; //January is 0!

          let yyyy = td.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }
          let today = yyyy + '-' + mm + '-' + dd;

          if (this.searchCondition.indexOf('&f_settleDate') < 0) {
            this.searchCondition += '&f_settleDate_op==&f_settleDate=' + today;
          }
          this.refresh();
        }
      }
    );
  }

  reset() {
    this.searchForm.reset();
  }

}
