import {environment} from '../../environments/environment';
import {UserType} from "../models/user-type.model";

export class Constants {
  public static CurrentUser = 'current-user';
  public static CurrentUserInfo = 'current-user-detail';
  public static API_ENDPOINT = environment.apiUrl;
 // public static RATE_API_ENDPOINT = environment.rateApiUrl;
  public static Status = {
    booked: 'BOOKED',
    payeesAdded: 'PAYEES_ADDED',
    processing: 'PROCESSING',
    received: 'RECEIVED',
    canceled: 'CANCELED',
    settled: 'SETTLED',
    statusForSpot: [
      'BOOKED',
      'PAYEES_ADDED',
      'PROCESSING',
      'CANCELED'
    ]
  };
  public static RecevedTrxType = {
    parent: 'parent-trx',
    undividableLeaf: 'leaf-trx-can-not-be-divide',
    dividableLeaf: 'leaf-trx-can-be-divide'
  };
  public static USER: UserType = {
    broker: 'BROKER',
    individual: 'INDIVIDUAL',
    company: 'COMPANY',
    backend: 'BACKEND',
    nonBackend: 'NONBACKEND'
  }
}
