import {Payer} from './payer.model';
import {BankAccount} from './bank-account.model';
import {Attachment} from "./attachment.model";


export class Payee {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  bookedAt: number;
  enable: boolean;
  verify: boolean;
  id: number;
  name: string;
  payer: Payer;
  postCode: string;
  status: string;
  payeeBankAccounts: BankAccount[];
  attachments: Attachment[];
  sameday: boolean;
}
