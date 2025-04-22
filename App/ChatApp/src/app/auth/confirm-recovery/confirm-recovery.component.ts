import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../core/services/auth.service";
import {LanguageService} from "../../core/services/language.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-recovery',
  templateUrl: './confirm-recovery.component.html',
  styleUrls: ['./confirm-recovery.component.scss']
})
export class ConfirmRecoveryComponent implements OnInit {

  confirmationRecoveryForm: FormGroup;
  year: number = new Date().getFullYear();

  submitted = false;
  errorMsg = '';
  successful = false;
  resent = false;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.confirmationRecoveryForm = this.fb.group({
      email: ['vasile.enachi@student.tuiasi.ro', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });
    this.activatedRouter.queryParams.subscribe(params => {
      if (params.email) {
        this.confirmationRecoveryForm.patchValue({
          email: params.email
        })
      }
    })
  }

  get f() { return this.confirmationRecoveryForm.controls; }

  onSubmit(): void {
    this.errorMsg = '';
    this.submitted = true;

    if (this.f.password.value != this.f.confirmPassword.value) {
      this.translateService.get(this.languageService.IDENTICAL_PASSWORDS).toPromise().then((result) => {
        this.errorMsg = result;
      })
      //this.toastr.error("Passwords are not identical.")
      return;
    }

    if (this.confirmationRecoveryForm.invalid) {
      this.translateService.get(this.languageService.INVALID_DATA).toPromise().then((result) => {
        this.toastr.error(result)
      })
      return;
    } else {
      this.authService.confirmRecovery(this.f.email.value, this.f.password.value, this.f.code.value)
        .then((user) => {
          console.log(user);
          this.translateService.get(this.languageService.SUCCESSFUL_RESET).toPromise().then((result) => {
            this.toastr.success(result);
          })
          this.router.navigateByUrl("auth/login");
          //this.successful = true;

        })
        .catch((err) => {
          this.errorMsg = err.message;
          this.toastr.error(err.message);
        })
    }
  }

  onResend(): void {

    if (this.f.email.errors) {
      this.translateService.get(this.languageService.INVALID_DATA).toPromise().then((result) => {
        this.toastr.error(result)
      })
      return;
    }

    this.resent = true;

    this.authService.recovery(this.f.email.value).then((user) => {
      console.log(user);
      this.translateService.get(this.languageService.INFO_CODE_RESENT).toPromise().then((result) => {
        this.toastr.success(result);
      })
    })
      .catch((err) => {
        switch (err.name) {
          case "NotAuthorizedException":
            this.translateService.get(this.languageService.SERVER_AUTHORIZATION).toPromise().then((result) => {
              this.errorMsg = result;
              this.toastr.error(result);
            })
            break;
          case "UserNotFoundException":
            this.translateService.get(this.languageService.SERVER_USER_NOT_FOUND).toPromise().then((result) => {
              this.errorMsg = result;
              this.toastr.error(result);
            })
            break;
          default:
            console.log(err.name);
            switch (err.name) {
              case "CodeMismatchException":
                this.translateService.get(this.languageService.SERVER_CODE_MISMATCH).toPromise().then((result) => {
                  this.errorMsg = result;
                  this.toastr.error(result);
                })
                break;
              default:
                this.errorMsg = err.message;
                this.toastr.error(err.message);
                break;
            }
            break;
        }
      })
  }

}
