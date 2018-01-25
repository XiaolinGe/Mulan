import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Constants} from '../../../constants/app.constant';
import {PayeeService} from '../../../services/payee.service';
import {Payee} from '../../../models/payee.model';
import {PayerService} from "../../../services/payer.service";
import {Payer} from "../../../models/payer.model";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'mrp-payee-list-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: []
})
export class PayeeListComponent implements OnInit {
  public payers: Payer[];
  public payees: Payee[];
  public payerId: number;
  public pageNumber: number;
  public pageSize: number;
  public totalSize: number;
  public keyword: string;

  title: string = 'Attention!';
  message: string = 'Are you really sure to disable this payee?';
  confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;
  public isBroker: boolean | any;
  public selectedPayer: Payer;


  constructor(public payeeService: PayeeService,
              public authenticationService: AuthenticationService,
              public payerService: PayerService) {
    this.pageNumber = 1;
    this.pageSize = 12;
  }

  ngOnInit(): void {
    // this.getPayerList();
    this.isBroker = this.authenticationService.checkIsBroker();
  }

  refresh() {
    console.log(this.keyword);
    console.log(this.payerId);
    this.payeeService.getAllByPagingAndPayerId(this.payerId, this.keyword, this.pageNumber, this.pageSize, Constants.Status.statusForSpot).subscribe((resp) => {
      console.log(resp);
      this.payees = resp.content;
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

  onPayerChanged(event) {
    console.log(event);
    this.payerId = event;
    this.refresh();
  }

  // getPayerList() {
  //   this.payerService.getAllByPaging(1, 10000).subscribe(resp => {
  //     this.payers = resp.content;
  //     console.log(resp);
  //     if (this.payers && this.payers.length > 0) {
  //       this.payersForSelect = JSON.parse(JSON.stringify(this.payers));
  //       this.payersForSelect.map(p => {
  //         p.text = p.name
  //       });
  //
  //       this.selectedPayer = [this.payersForSelect[0]];
  //       this.payerId = this.payers[0].id;
  //       this.refresh();
  //     }
  //   })
  // }

  disable(id: number, bool: boolean) {
    this.payeeService.disablePayee(id, bool).subscribe(resp => {
      console.log(resp);
      this.refresh();
    });
  }

  myPayerSelected($event) {
    console.log($event);
    if ($event) {
      this.selectedPayer = $event;
      this.payerId = this.selectedPayer.id;
      this.refresh();
    }
  }

}
