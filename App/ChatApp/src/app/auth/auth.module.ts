import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from "../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import { RecoveryComponent } from './recovery/recovery.component';
import { ConfirmRegisterComponent } from './confirm-register/confirm-register.component';
import { ConfirmRecoveryComponent } from './confirm-recovery/confirm-recovery.component';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {SimplebarAngularModule} from "simplebar-angular";
import {TabsModule} from "../chat/tabs/tabs.module";
import { FooterComponent } from './shared/footer/footer.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoveryComponent,
    ConfirmRegisterComponent,
    ConfirmRecoveryComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    AuthRoutingModule,
    PerfectScrollbarModule,
    PickerModule,
    SimplebarAngularModule,
    TabsModule
  ]
})
export class AuthModule { }
