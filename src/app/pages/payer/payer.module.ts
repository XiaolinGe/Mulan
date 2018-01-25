import {PayerEditComponent} from './edit/edit.component';
import {PayerAddComponent} from './add/add.component';
import {PayerComponent} from './payer.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DropzoneModule} from "ngx-dropzone-wrapper";
import {PayerListComponent} from "./list/list.component";
import {NgxPaginationModule} from "ngx-pagination";
import {SharedModule} from "../../theme/shared/shared.module";

export const routes = [
  {path: '', component: PayerComponent, pathMatch: 'full'},
  {path: 'add', component: PayerAddComponent, pathMatch: 'full'},
  {path: 'edit', component: PayerEditComponent, pathMatch: 'full'},
  {path: 'list', component: PayerListComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropzoneModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    SharedModule
  ],
  declarations: [
    PayerComponent,
    PayerAddComponent,
    PayerEditComponent,
    PayerListComponent
  ]
})
export class PayerModule {
}
