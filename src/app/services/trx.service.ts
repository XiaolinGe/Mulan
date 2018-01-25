import {Injectable, OnInit} from '@angular/core';
import {Constants} from '../constants/app.constant';
import {MyHttp} from './http.client.service';
import {Payer} from '../models/payer.model';
import {SubmitTrx} from '../models/submit-trx/submit.trx.model';
import {Trx} from '../models/trx.model';
import {ToAddTrx} from '../models/submit-trx/toAdd.trx.model';
import {Payee} from '../models/payee.model';
import {BankAccount} from '../models/bank-account.model';
import {ToAddPayee} from "../models/submit-trx/toAdd.payee.model";
import {ToAddPayer} from "../models/submit-trx/toAdd.payer.model";
import {TrxChild} from "../models/submit-trx/child.trx.model";
import {rendererTypeName} from "@angular/compiler";
import {Changeability} from "../models/Changeability";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import * as R from 'ramda';

@Injectable()
export class TrxService implements OnInit {


  public trxUrl = Constants.API_ENDPOINT + 'v1/transaction';

  constructor(private http: MyHttp) {
  }

  ngOnInit(): void {

  }

  // v1/transaction/:id/sub-transactions
  submitTrx(id: number, trx: SubmitTrx) {
    return this.http.post(`${this.trxUrl}/${id}/split`, trx)
      .map((response) => response.json())
      .catch(res => Observable.throw(res.json()));
  }

  // updateTrx(id: number, trx: SubmitTrx) {
  //   return this.http.put(`${this.trxUrl}/${id}/split`, trx).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  // }

  updateTrx(id: number, trx: SubmitTrx) {
    return this.http.put(`${this.trxUrl}/${id}`, trx).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  getTrx(id: number) {
    return this.http.get(this.trxUrl + '/' + id).map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }


  getAllByPaging(pageNumber: number, pageSize: number, status: string[]) {
    const queryString = status.join('&f_status=');
    return this.http.get(this.trxUrl + '?page=' + pageNumber + '&size=' + pageSize + '&f_status=' + queryString)
      .map((response) => response.json()).catch(res => Observable.throw(res.json()));
  }

  TransferTrxToSubmit(toAddTrx: ToAddTrx) {
    const tosubmitTrx: SubmitTrx = new SubmitTrx();
    tosubmitTrx.id = toAddTrx.id;
    tosubmitTrx.buyAmount = toAddTrx.buyAmount;
    tosubmitTrx.buyCurrency = toAddTrx.buyCurrency;
    tosubmitTrx.orderId = toAddTrx.orderId;
    tosubmitTrx.payAmount = toAddTrx.sellAmount;
    tosubmitTrx.children = [];

    toAddTrx.payers.forEach(payer => {
      if (payer.payees.length > 0) {
        payer.payees.forEach(payee => {
          const tempToSubmitTrx: SubmitTrx = new SubmitTrx();
          tempToSubmitTrx.payer = new Payer();
          tempToSubmitTrx.payee = new Payee();
          tempToSubmitTrx.payeeBankAccount = new BankAccount();
          tempToSubmitTrx.payer.id = payer.id;
          tempToSubmitTrx.payee.id = payee.id;
          tempToSubmitTrx.payeeBankAccount.id = payee.payeeBankAccountId;
          tempToSubmitTrx.payAmount = payee.payAmount;
          tempToSubmitTrx.sameday = payee.sameday;
          tempToSubmitTrx.paymentReason = payee.paymentReason;

          tosubmitTrx.children.push(tempToSubmitTrx);
        });
      }
    });
    return tosubmitTrx;
  }

  //
  // /**
  //  * convert leaf trx to ToAddTrx
  //  * */
  // TransferLeafTrx(submitTrx: SubmitTrx) {
  //   const toAddTrx: ToAddTrx = new ToAddTrx();
  //
  //   const toAddPayee: ToAddPayee = new ToAddPayee();
  //   toAddPayee.payAmount = submitTrx.buyAmount;
  //   toAddPayee.paymentReason = submitTrx.paymentReason;
  //   toAddPayee.payeeBankAccount = submitTrx.payeeBankAccount;
  //
  //   const toAddPayer = new ToAddPayer();
  //   toAddPayer.payees = [];
  //   toAddPayer.payees.push(toAddPayee);
  //
  //   toAddTrx.payers = [];
  //   toAddTrx.payers.push(toAddPayer);
  //
  //   return toAddTrx;
  // }
  getReceicedTrxType(trx: SubmitTrx) {
    let type;
    if (trx.children && trx.children.length > 0) {
      type = Constants.RecevedTrxType.parent;
    } else if (trx.payer && trx.payer.id > 0) {
      type = Constants.RecevedTrxType.dividableLeaf;
    } else {
      type = Constants.RecevedTrxType.undividableLeaf;
    }
    return type;
  }

  getOriginalTrxId(trx: SubmitTrx) {
    if (trx.parent && trx.parent.id > 0) {
      return trx.parent.id;
    } else {
      return null;
    }
  }

  getTrxChangeability(trx: SubmitTrx | ToAddTrx) {
    let c = new Changeability();
    c.editable = true;
    c.dividable = true;
    c.isParent = false;

    // 如果是叶子节点，不能拆单，但可以编辑
    if (trx.parent && trx.parent.id > 0) {
      c.dividable = false;
    }

    // 如果包含children，为父节点
    if (trx.children && trx.children.length > 0) {
      c.isParent = true;
    }

    if (trx.status === Constants.Status.settled
      || trx.status === Constants.Status.canceled
      || trx.status === Constants.Status.processing
      || trx.status === Constants.Status.received) {
      // settled／取消 的交易不能编辑或者拆单
      c.dividable = false;
      c.editable = false;
    }

    return c;
  }


  /**
   * convert Parent with leaf trx to ToAddTrx
   * */
  TransferToAddTrx(submitTrx: SubmitTrx) {
    let toAddTrx: ToAddTrx = new ToAddTrx();
    // 复制订单基本信息
    toAddTrx.id = submitTrx.id;
    toAddTrx.isLeaf = submitTrx.isLeaf;
    toAddTrx.parent = submitTrx.parent;
    toAddTrx.bookedAt = submitTrx.bookedAt;
    toAddTrx.orderId = submitTrx.orderId;
    toAddTrx.buyCurrency = submitTrx.buyCurrency;
    toAddTrx.buyAmount = submitTrx.buyAmount;
    toAddTrx.sellCurrency = submitTrx.sellCurrency;
    toAddTrx.sellAmount = submitTrx.sellAmount;
    toAddTrx.baseRate = submitTrx.baseRate;
    toAddTrx.salesRate = submitTrx.salesRate;
    toAddTrx.rate = submitTrx.rate;
    toAddTrx.status = submitTrx.status;
    toAddTrx.type = submitTrx.type;
    toAddTrx.overnightRate = submitTrx.overnightRate;
    toAddTrx.serviceFee = submitTrx.serviceFee;

    toAddTrx.children = [];
    let child: TrxChild = new TrxChild;

    /**
     *  第一种情况：返回的有children,该订单已经拆单过，是👨父节点
     *  ==> 不可以再拆单
     * */
    if (submitTrx.children.length > 0) {
      // // 如果是父节点
      // let payerId = submitTrx.children[0].payer.id;
      // let tempPayer = submitTrx.children[0].payer;
      // child.payer = submitTrx.children[0].payer;
      // child.payees = [];
      //
      // toAddTrx.children.push(child);

      let i = 0;

      let payerId = submitTrx.children[0].payer.id;
      // debugger;
      //
      // var byPayerId = R.groupBy(function (child) {
      //   return child.payer.id;
      // });
      //
      // console.log(byPayerId(submitTrx.children)
      //   .map()
      // );

      var process =
        R.pipe(
          R.map(o => {
            let t = Object.assign({}, o);
            t.payee.payeeBankAccount = o.payeeBankAccount;
            t.payee.payeeBankAccountId = o.payeeBankAccount.id;
            t.payee.payAmount =  o.payAmount;
            t.payee.sameday =  o.sameday;
            t.payee.paymentReason = o.paymentReason;

            // t = Object.assign(t, o.payeeBankAccount);
            // t = Object.assign(t, o.payeeBankAccount.id);
            // t = Object.assign(t, o.payAmount);
            // t = Object.assign(t, o.paymentReason);


            return t;
          }),
          R.groupBy(function (child) {
            return child.payer.id;
          }),
          R.values,
          R.filter(o => o.length > 0),
          R.map(obj => {
            return {
              payer: obj[0].payer,
              payees: R.map(obj2 => obj2.payee, obj)
            }
          })
        );

      console.log(process(submitTrx.children));

      toAddTrx.children = process(submitTrx.children);
      // submitTrx.children.forEach(c => {
      //
      //   let toAddPayee: ToAddPayee = new ToAddPayee();
      //   toAddPayee.id = c.payee.id;
      //   toAddPayee.payeeBankAccountId = c.payeeBankAccount.id;
      //   toAddPayee.payeeBankAccount = c.payeeBankAccount;
      //   toAddPayee.payAmount = c.payAmount;
      //   toAddPayee.paymentReason = c.paymentReason;
      //   toAddPayee.name = c.payee.name;
      //
      //   let trxChild = new TrxChild();
      //   trxChild.payees.push(toAddPayee);
      //   trxChild.payer = c.payer;
      //
      //   toAddTrx.children.push(trxChild);
      // })
    }
    /**
     *  第二种情况：返回的没有children,但是已经添加了payer和payee (Booked状态)
     *  ==> 可以再拆单
     * */
    else if (submitTrx.payer && submitTrx.payer.id > 0) {
      let toAddPayee: ToAddPayee = new ToAddPayee();
      toAddPayee.payAmount = submitTrx.buyAmount;
      toAddPayee.paymentReason = submitTrx.paymentReason;
      toAddPayee.sameday = submitTrx.sameday;
      toAddPayee.payeeBankAccount = submitTrx.payeeBankAccount;
      if (submitTrx.payeeBankAccount) {
        toAddPayee.payeeBankAccountId = submitTrx.payeeBankAccount.id;
      }

      if (submitTrx.payee) {
        toAddPayee.name = submitTrx.payee.name;
        toAddPayee.id = submitTrx.payee.id;
      }
      child.payees = [toAddPayee];
      child.payer = submitTrx.payer;

      toAddTrx.children.push(child);
    }

    return toAddTrx;
  }

}
