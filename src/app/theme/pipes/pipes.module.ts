import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppPicturePipe} from './appPicture/appPicture.pipe';
import {ProfilePicturePipe} from './profilePicture/profilePicture.pipe';
import {MailSearchPipe} from './search/mail-search.pipe';
import {SearchPipe} from './search/search.pipe';
import {FourDecimalPipe} from "./decimalPipe/four-decimal.pipe";
import {TwoDecimalPipe} from "./decimalPipe/two-decimal.pipe";
import {SecondsToTimePipe} from "./secondsToTimePipe/seconds-to-time";

// shared module
// do not provide services in Shared Modules! Especially not if you plan to use them in Lazy Loaded Modules!
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    // the pipe should declare once some where and only once.
    AppPicturePipe,
    ProfilePicturePipe,
    MailSearchPipe,
    SearchPipe,
    FourDecimalPipe,
    TwoDecimalPipe,
    SecondsToTimePipe
  ],
  exports: [
    AppPicturePipe,
    ProfilePicturePipe,
    MailSearchPipe,
    SearchPipe,
    FourDecimalPipe,
    TwoDecimalPipe,
    SecondsToTimePipe
  ]
})
export class PipesModule {
}
