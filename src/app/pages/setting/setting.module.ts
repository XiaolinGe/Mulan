
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProfileComponent} from './profile/profile.component';
import {UpdateComponent} from './update-password/update.component';
import {SettingComponent} from './setting.component';
import {SharedModule} from "../../theme/shared/shared.module";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";

export const routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path: 'profile', component: ProfileComponent, pathMatch: 'full'},
  {path: 'update-password', component: UpdateComponent, pathMatch: 'full'}
  ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    SharedModule,
    ConfirmationPopoverModule
  ],
  declarations: [
    SettingComponent,
    ProfileComponent,
    UpdateComponent
  ]
})
export class SettingModule {
}
