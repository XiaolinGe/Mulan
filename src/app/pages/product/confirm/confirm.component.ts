import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeService} from '../../home/home.service';
import {TrxService} from '../../../services/trx.service';
import {Trx} from '../../../models/trx.model';
import {ActivatedRoute, Params} from '@angular/router';
import {AutoUnsubscribe} from "ngx-auto-unsubscribe";
@AutoUnsubscribe()
@Component({
  selector: 'mrp-confirm-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: []
})
export class TrxConfirmComponent implements OnInit {
  public trx: Trx;
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
      this.trx = resp;
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
