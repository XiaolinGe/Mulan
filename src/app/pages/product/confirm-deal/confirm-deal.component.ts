import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeService} from '../../home/home.service';
import {TrxService} from '../../../services/trx.service';
import {Trx} from '../../../models/trx.model';
import {ActivatedRoute, Params} from '@angular/router';
import {SubmitTrx} from "../../../models/submit-trx/submit.trx.model";
import {ToAddPayer} from "../../../models/submit-trx/toAdd.payer.model";
import {ToAddTrx} from "../../../models/submit-trx/toAdd.trx.model";
import {AutoUnsubscribe} from "ngx-auto-unsubscribe";

@Component({
  selector: 'mrp-confirm-deal-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './confirm-deal.component.html',
  styleUrls: ['./confirm-deal.component.scss'],
  providers: []
})
@AutoUnsubscribe()
export class ConfirmDealComponent implements OnInit {
  public receivedTrx: SubmitTrx;
  public trx: ToAddTrx;
  public trxId: number;

  constructor(public  homeService: HomeService,
              public trxService: TrxService,
              private activatedRoute: ActivatedRoute) {

    this.getTrxId();

  }

  ngOnInit() {

  }

  getTrx() {
    this.trxService.getTrx(this.trxId).subscribe(resp => {
      this.receivedTrx = resp;
      console.log(resp);

      /**
       *  转换trx
       * */
      this.trx = this.trxService.TransferToAddTrx(this.receivedTrx);
      console.log(this.trx);
    });
  }

  getTrxId() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.trxId = params['id'];
      this.getTrx();
    });
  }

}
