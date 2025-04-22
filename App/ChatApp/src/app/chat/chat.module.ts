import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { IndexComponent } from './index/index.component';
import {TranslateModule} from "@ngx-translate/core";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {LightboxModule} from "ngx-lightbox";
import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TabsModule} from "./tabs/tabs.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    SharedModule,
    PerfectScrollbarModule,
    LightboxModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbCollapseModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatRoutingModule,
    TabsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    TranslateModule,
    SimplebarAngularModule,
    PickerModule,
  ],
  providers: [
    DatePipe
  ],
  exports: []
})
export class ChatModule { }
