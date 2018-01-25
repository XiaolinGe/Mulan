import {Attachment} from './attachment.model';

export class PayerSubmit {
  name: string;
  country: string;
  city: string;
  address: string;
  attachments: Attachment[];
}
