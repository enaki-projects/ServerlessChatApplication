import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../core/services/auth.service";
import {BusyService} from "../../core/services/effects/busy.service";
import {LanguageService} from "../../core/services/language.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

  recoveryForm: FormGroup;
  year: number = new Date().getFullYear();

  submitted = false;
  errorMsg = '';
  successful = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: BusyService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.recoveryForm.controls; }

  onSubmit(): void {
    this.errorMsg = '';
    this.submitted = true;

    if (this.recoveryForm.invalid) {
      this.translateService.get(this.languageService.INVALID_DATA).toPromise().then((result) => {
        this.toastr.error(result)
      })
      return;
    }
    else {
      this.loadingService.busy();
      this.authService.recovery(this.f.email.value)
        .then((user) => {
          console.log(user);
          this.translateService.get(this.languageService.INIT_RESET).toPromise().then((result) => {
            this.toastr.info(result);
          })
          this.router.navigateByUrl("auth/confirm-recovery?email=" + this.f.email.value);
          //this.successful = true;
        })
        .catch((err) => {
          console.log(err)
          switch (err.name) {
            case "InvalidParameterException":
              this.translateService.get(this.languageService.SERVER_INVALID_PARAMETER).toPromise().then((result) => {
                this.errorMsg = result;
                this.toastr.info(result);
                this.router.navigateByUrl("auth/confirm-register?email=" + this.f.email.value);
              })
              break;
            case "UserNotFoundException":
              this.translateService.get(this.languageService.SERVER_USER_NOT_FOUND).toPromise().then((result) => {
                this.errorMsg = result;
                this.toastr.error(result);
              })
              break;
            default:
              this.errorMsg = err.message;
              this.toastr.error(err.message);
              break;
          }
        })
        .finally(() => {
          this.loadingService.idle();
        })
    }
  }
}
