import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import { UserSearchComponent } from './user-search/user-search.component';
import {SharedModule} from "../../shared/shared.module";
import {ToastrModule} from "ngx-toastr";
import {SimplebarAngularModule} from "simplebar-angular";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ContactsComponent,
    ProfileComponent,
    SettingsComponent,
    UserSearchComponent
  ],
  imports: [
    SharedModule,
    CarouselModule,
    CommonModule,
    NgbDropdownModule,
    NgbAccordionModule,
    PerfectScrollbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbCollapseModule,
    TranslateModule,
    FormsModule,
    SimplebarAngularModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center'
    }),
  ],
  exports: [ProfileComponent, ContactsComponent, SettingsComponent, UserSearchComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class TabsModule { }
