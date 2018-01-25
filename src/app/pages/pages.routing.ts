import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages.component';
import {AuthGuard} from "../guards/auth.guard";

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule'},
            { path: 'product', loadChildren: 'app/pages/product/product.module#TrxModule'},
            { path: 'payers', loadChildren: 'app/pages/payer/payer.module#PayerModule'},
            { path: 'payees', loadChildren: 'app/pages/payee/payee.module#PayeeModule'},
            { path: 'setting', loadChildren: 'app/pages/setting/setting.module#SettingModule'},
            { path: 'balance', loadChildren: 'app/pages/balance/balance.module#BalanceModule'}
        ],
     /* canActivate: [AuthGuard]*/
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
