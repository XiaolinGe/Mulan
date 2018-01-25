import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {ValidationMessageComponent} from '../../theme/components/validation-message/validation-message';
import {ValidationMessagesComponent} from '../../theme/components/validation-message/validation-messages';
import {PipesModule} from '../../theme/pipes/pipes.module';
import {DirectivesModule} from '../../theme/directives/directives.module';
import {ModalModule} from 'ngx-modal';
// import {BusyModule} from 'angular2-busy';

export const routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: HomeComponent, pathMatch: 'full'}
  ];

@NgModule({
  imports: [
    CommonModule, // give access to common directive, like NgClas, NgIf ..., So it need to be imported to every feature module.
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), // angy router module not in the root need to use forChild
    DirectivesModule,
    PipesModule,
    ModalModule,
    // BusyModule
  ],
  declarations: [
    HomeComponent,
    ValidationMessagesComponent,
    ValidationMessageComponent
  ]
})
export class HomeModule {
}
