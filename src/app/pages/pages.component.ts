import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SplashScreenService} from "../services/splash.screen.service";

@Component({
  selector: 'mrp-pages',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: []
})
export class PagesComponent {
  public isCollapsed = true;
  constructor(public splashScreen: SplashScreenService) {
    splashScreen.show();
    splashScreen.hide();
    this.isCollapsed = true;
  }

}
