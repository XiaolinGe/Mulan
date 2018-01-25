import {ToAddPayer} from './toAdd.payer.model';
import {TrxChild} from './child.trx.model';
import {ParentTrx} from "./parent.trx.model";

export class ToAddTrx {
  payers: ToAddPayer[];

  // 以下字段和trx共有
  baseRate: number;
  buyAmount: number;
  buyCurrency: string;
  checked: boolean
  bookedAt: string;
  id: number;
  isCalculateFromBuyToSell: boolean;
  isLeaf: boolean
  orderId: string;
  rate: number;
  reversed: boolean
  salesRate: number;
  sellAmount: number;
  sellCurrency: string;
  status: string;
  type: string;
  updatedAt: number;
  parent: ParentTrx;

  overnightRate: number;
  serviceFee: number;

  // for confirm
  children: TrxChild[];
}
