import {ParentTrx} from "./submit-trx/parent.trx.model";

export class Trx {
  baseRate: number;
  buyAmount: number;
  buyCurrency: string;
  checked: boolean
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
  bookedAt: number;
  parent: ParentTrx;
}
