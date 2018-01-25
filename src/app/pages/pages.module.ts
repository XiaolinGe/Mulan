import { NavbarComponent } from './../theme/components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './pages.routing';
import { PagesComponent } from './pages.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BankAccountComponent} from "../theme/shared/bank-account-component/bank-account.component";


@NgModule({
  imports: [
    CommonModule,
    routing,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    PagesComponent,
    NavbarComponent
  ]
})
export class PagesModule { }

// @NgModule transform normal class to Angular Class
