import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'bank-account-component',
  templateUrl: 'bank-account.component.html',
  styleUrls: ['bank-account.component.scss']
})
export class BankAccountComponent {
  @Input('group')
  public bankAccountForm: FormGroup;
}
