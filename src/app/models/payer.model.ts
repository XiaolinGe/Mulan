import {Payee} from "./payee.model";

export class Payer {
  address: string;
  city: string;
  country: string;
  bookedAt: number;
  id: number;
  name: string;
  updatedAt: number;
  verify: boolean;
  payees: Payee[];
  text: string;
}
