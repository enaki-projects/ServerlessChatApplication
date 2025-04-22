import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {RecoveryComponent} from "./recovery/recovery.component";
import {ConfirmRegisterComponent} from "./confirm-register/confirm-register.component";
import {ConfirmRecoveryComponent} from "./confirm-recovery/confirm-recovery.component";


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'confirm-register',
    component: ConfirmRegisterComponent,
  },
  {
    path: 'recovery',
    component: RecoveryComponent,
  },
  {
    path: 'confirm-recovery',
    component: ConfirmRecoveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
