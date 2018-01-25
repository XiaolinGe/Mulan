import {RouterModule} from '@angular/router';
import {TrxComponent} from './product.component';
import {NgModule} from '@angular/core';
import {TrxAddComponent} from './add/add.component';
import {ProductListComponent} from './list/list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from '../../theme/directives/directives.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {TrxConfirmComponent} from './confirm/confirm.component';
import {TrxEditComponent} from './edit/edit.component';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgxPaginationModule} from 'ngx-pagination';
import {TrxHistoryComponent} from './history/list.component';
import {PayerSubmitComponent} from './payer-submit-component/payer-submit.component';
import {PayeeSubmitComponent} from './payee-submit-component/payee-submit.component';
import {ConfirmDealComponent} from './confirm-deal/confirm-deal.component';
import {ModalModule} from "ngx-modal";
import {PipesModule} from "../../theme/pipes/pipes.module";
import {LoadingModule} from "ngx-loading";
import {CategoryListComponent} from "./category-list/category-list.component";
import {ProductDetailComponent} from "./detail/detail.component";

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: ProductListComponent, pathMatch: 'full'},
  {path: 'category', component: CategoryListComponent, pathMatch: 'full'},
  {path: ':id', component: ProductDetailComponent, pathMatch: 'full'},
  {path: 'history', component: TrxHistoryComponent, pathMatch: 'full'},
  {path: 'add', component: TrxAddComponent, pathMatch: 'full'},
  {path: 'edit/:id', component: TrxEditComponent, pathMatch: 'full'},
  {path: 'confirm/:id', component: TrxConfirmComponent, pathMatch: 'full'},
  {path: 'confirm-deal/:id', component: ConfirmDealComponent, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    DropzoneModule,
    SharedModule,
    NgxPaginationModule,
    ModalModule,
    PipesModule,
    LoadingModule
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    CategoryListComponent,


    TrxComponent,
    TrxAddComponent,
    TrxConfirmComponent,
    TrxEditComponent,
    TrxHistoryComponent,
    PayeeSubmitComponent,
    PayerSubmitComponent,
    ConfirmDealComponent
  ]
})
export class TrxModule {
}
