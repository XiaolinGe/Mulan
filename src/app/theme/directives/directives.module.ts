import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SlimScroll} from './slim-scroll/slim-scroll.directive';
import {Widget} from './widget/widget.directive';
import {Skycon} from './skycon/skycon.directive';
import {Counter} from './counter/counter.directive';
import {LiveTile} from './live-tile/live-tile.directive';
import {ProgressAnimate} from './progress-animate/progress-animate.directive';
import {DropzoneUpload} from './dropzone/dropzone.directive';
import {FourDecimalDirective} from './decimal/four-decimal.directive';
import {TwoDecimalDirective} from './decimal/two-decimal.directive';
import {PipesModule} from '../pipes/pipes.module';
import {CustomDisabledDirective} from "./custom.disable.directive";

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [
    SlimScroll,
    Widget,
    Skycon,
    Counter,
    LiveTile,
    ProgressAnimate,
    DropzoneUpload,
    FourDecimalDirective,
    TwoDecimalDirective,
    CustomDisabledDirective
  ],
  exports: [
    SlimScroll,
    Widget,
    Skycon,
    Counter,
    LiveTile,
    ProgressAnimate,
    DropzoneUpload,
    FourDecimalDirective,
    TwoDecimalDirective,
    CustomDisabledDirective
  ]
})
export class DirectivesModule {
}
