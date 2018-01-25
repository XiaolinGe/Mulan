import {Payer} from '../payer.model';
import {Payee} from '../payee.model';
import {ToAddPayee} from './toAdd.payee.model';

export class ParentTrx {
  checked: boolean;
  id: number;
  reversed: boolean;
}
