import 'reflect-metadata';

import 'pace';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AgmCoreModule} from '@agm/core';

import {routing} from './app.routing';
import {AppConfig} from './app.config';

import {AppComponent} from './app.component';
import {ErrorComponent} from './pages/error/error.component';
import {BeneficiaryService} from './services/beneficiary.service';
import {HttpModule} from '@angular/http';
import {AuthenticationService} from './services/authentication.service';
import {AccountService} from './services/account.service';
import {LocalStoreService} from './services/localStore.service';
import {HomeService} from './pages/home/home.service';
import {MyHttp} from './services/http.client.service';
import {HelperService} from './services/helper.service';
import {ProductService} from './services/product.service';
import {DropzoneConfigInterface, DropzoneModule} from 'ngx-dropzone-wrapper';
import {Constants} from './constants/app.constant';
import {PayerService} from './services/payer.service';
import {PayeeService} from './services/payee.service';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
// import {BusyConfig, BusyModule} from "angular2-busy";
import {ToastContainerModule, ToastrConfig, ToastrModule, ToastrService} from "ngx-toastr";
import {MessageService} from "./services/message.service";
import {BalanceService} from "./services/balance.service";
import {ANIMATION_TYPES, LoadingModule} from "ngx-loading";
import {SplashScreenService} from "./services/splash.screen.service";
import {AuthGuard} from "./guards/auth.guard";

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: Constants.API_ENDPOINT + 'v1/file',
  maxFilesize: 50,
  acceptedFiles: 'image/*, application/pdf',
  addRemoveLinks: true,
  clickable: true
};


@NgModule({
  // we can not declare components pipes and all directices in more than one module.
  declarations: [
    AppComponent,
    ErrorComponent,

  ],
  // we import modules so we can use the directives and services from the module.
  imports: [
    BrowserModule, // BroserModule contains all feature of CommonModule. And some other features only need at the start of the app begins.
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    }),
    routing,
    HttpModule,
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'success' // set defaults here
    }),
    // BusyModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    ToastContainerModule.forRoot(),
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      // backdropBackgroundColour: 'rgba(0,0,0,0.3)',
      backdropBackgroundColour: 'rgba(157, 169, 202, 0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#545FDF',
      secondaryColour: '#545FDF',
      tertiaryColour: '#545FDF'
    })
  ],

  // provides declare the services we may use in the module.
  // Everything we provide here will be provided to the whole applocation.
  providers: [
    AppConfig,
    BeneficiaryService,
    AuthenticationService,
    AccountService,
    LocalStoreService,
    HomeService,
    ProductService,
    PayerService,
    PayeeService,
    MyHttp,
    HelperService,
    ToastrService,
    MessageService,
    BalanceService,
    SplashScreenService,
    AuthGuard
  ],
  // root component
  bootstrap: [AppComponent]
})
export class AppModule {
}
