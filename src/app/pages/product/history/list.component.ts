import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TrxService} from "../../../services/trx.service";
import {Trx} from "../../../models/trx.model";
import {Constants} from "../../../constants/app.constant";

@Component({
  selector: 'mrp-history-list-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: []
})
export class TrxHistoryComponent implements OnInit {
  transactions: Trx[];
  public pageNumber: number;
  public pageSize: number;
  public totalSize: number;

  constructor(public transactionService: TrxService) {
    this.pageNumber = 1;
    this.pageSize = 12;
  }

  ngOnInit(): void {
    this.refresh();
    console.log('get transactions');
  }

  refresh() {
    this.transactionService.getAllByPaging(this.pageNumber, this.pageSize, [Constants.Status.settled]).subscribe((resp) => {
      console.log(resp);
      this.transactions = resp.content;
      this.totalSize = resp.totalElements;
    });
  }

  pageChanged(event) {
    console.log(event);
    this.pageNumber = event;
    this.refresh();
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.refresh();
  }

}
