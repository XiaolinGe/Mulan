import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BankAccountComponent} from './bank-account-component/bank-account.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidationErrorComponent} from './validation-error/validation-error.component';
import {SelectModule} from 'ng2-select';
import {MyPayerSelectComponent} from './my-payer-select/my-payer-select.component';


// shared module
// do not provide services in Shared Modules! Especially not if you plan to use them in Lazy Loaded Modules!
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule
  ],
  declarations: [
    // the pipe should declare once some where and only once.
    BankAccountComponent,
    ValidationErrorComponent,
    MyPayerSelectComponent
  ],
  exports: [
    BankAccountComponent,
    ValidationErrorComponent,
    MyPayerSelectComponent
  ]
})
export class SharedModule {
}
