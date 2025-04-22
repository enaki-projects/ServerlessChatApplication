import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastrModule} from "ngx-toastr";
import {ReactiveFormsModule} from "@angular/forms";
import {TextInputComponent} from './_forms/text-input/text-input.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import { ImageWithLoadingComponent } from './_utils/image-with-loading/image-with-loading.component';


@NgModule({
  declarations: [
    TextInputComponent,
    ImageWithLoadingComponent
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center'
    }),
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxSpinnerModule
  ],
  exports: [
    ToastrModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxSpinnerModule,

    TextInputComponent,
    ImageWithLoadingComponent
  ],
})
export class SharedModule { }
