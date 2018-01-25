import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from '../../theme/directives/directives.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgxPaginationModule} from 'ngx-pagination';
import {ModalModule} from 'ngx-modal';
import {PipesModule} from '../../theme/pipes/pipes.module';

import {BalanceListComponent} from './list/balance-list.component';
import {LoadingModule} from "ngx-loading";

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: BalanceListComponent, pathMatch: 'full'},
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
    BalanceListComponent
  ]
})
export class BalanceModule {
}
