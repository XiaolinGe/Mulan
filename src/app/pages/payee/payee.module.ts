import { PayeeEditComponent } from './edit/edit.component';
import { PayeeAddComponent } from './add/add.component';
import { PayeeComponent } from './payee.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {PayeeListComponent} from './list/list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {PayeeBankAccountComponent} from './payee-bank-account-component/payee-bank-account.component';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {SharedModule} from '../../theme/shared/shared.module';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {SelectModule} from 'ng2-select';

export const routes = [
  {path: '', component: PayeeComponent, pathMatch: 'full'},
  {path: 'add', component: PayeeAddComponent, pathMatch: 'full'},
  {path: 'list', component: PayeeListComponent, pathMatch: 'full'},
  {path: 'edit/:id', component: PayeeAddComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    ConfirmationPopoverModule,
    SharedModule,
    DropzoneModule,
    SelectModule
  ],
  declarations: [
    PayeeComponent,
    PayeeAddComponent,
    PayeeEditComponent,
    PayeeListComponent,
    PayeeBankAccountComponent
  ]
})
export class PayeeModule {
}
