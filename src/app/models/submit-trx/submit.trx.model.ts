import {Payee} from '../payee.model';
import {Payer} from '../payer.model';
import {BankAccount} from '../bank-account.model';
import {ParentTrx} from "./parent.trx.model";

export class SubmitTrx {
  id: number;
  buyAmount: number;
  buyCurrency: string;
  expectedRate: string;
  orderId: string;
  overnightRate: number;
  payAmount: number;
  paymentReason: string;
  rate: number;
  sellAmount: number;
  sellCurrency: string;
  serviceFee: number;
  payee: Payee;
  payer: Payer;
  payeeBankAccount: BankAccount;
  parent: ParentTrx;
  children: SubmitTrx[];

  // 后台返回多的字段
  baseRate: number;
  checked: string;
  isLeaf: boolean;
  reversed: string;
  salesRate: number;
  status: string;
  type: string;
  bookedAt: string;
  sameday: boolean;
}


