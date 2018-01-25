import {SpotComponent} from './spot.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

export const routes = [
  {path: '', component: SpotComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SpotComponent
  ]
})
export class SpotModule {
}
