
import {BankAccount} from '../bank-account.model';

export class ToAddPayee {
  id: number;
  payeeBankAccountId: number;
  payeeBankAccount: BankAccount;
  name: string;
  payAmount: number;
  paymentReason: string;
  sameday: boolean;

}
