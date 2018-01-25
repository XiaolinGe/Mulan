import {BalanceSettlement} from './balance-settlement.model';
import {BalanceIncoming} from './balance-incoming.model';

export class Balance {
    currency: string;
    endOfTheDay: string;
    id: number;
    opening: number;
    settleDate: string;
    version: string;
    isSelected: boolean;
    clientFund: boolean;
    balanceIncomings: BalanceIncoming[];
    balanceSettlements: BalanceSettlement[];
}
