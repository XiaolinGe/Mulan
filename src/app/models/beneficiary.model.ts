import { BeneficiaryBankAccount } from './beneficiary-bank-accounts.model';
export class Beneficiary {
    public id: string;
    public saveAs: string;
    public firstName: string;
    public lastName: string;
    public telephone: string;
    public email: string;
    public bankAccounts: BeneficiaryBankAccount[];
}
