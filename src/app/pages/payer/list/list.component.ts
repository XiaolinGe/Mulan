import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PayerService} from '../../../services/payer.service';
import {Payer} from '../../../models/payer.model';

@Component({
  selector: 'mrp-payer-list-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: []
})
export class PayerListComponent implements OnInit {
  payers: Payer[];
  public pageNumber: number;
  public pageSize: number;
  public totalSize: number;
  constructor(public payerService: PayerService) {
    this.pageNumber = 1;
    this.pageSize = 12;
  }

  ngOnInit(): void {
    this.getPayers();
    console.log('get payers');
  }

  getPayers(): any {
    this.payerService.getPayers().subscribe(resp => {
      this.payers = resp.content;
    });
  }

  refresh() {
    this.payerService.getAllByPaging(this.pageNumber, this.pageSize).subscribe((resp) => {
      console.log(resp);
      this.payers = resp.content;
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
