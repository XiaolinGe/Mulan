import {Payer} from '../payer.model';
import {Payee} from '../payee.model';
import {ToAddPayee} from './toAdd.payee.model';

export class TrxChild {
  payer: Payer;
  payees: ToAddPayee[];

  constructor(){
    this.payer = new Payer();
    this.payees = [];
  }
}
