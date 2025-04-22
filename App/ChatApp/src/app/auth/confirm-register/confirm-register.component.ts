import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../core/services/auth.service";
import {LanguageService} from "../../core/services/language.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.scss']
})
export class ConfirmRegisterComponent implements OnInit {

  confirmationRegisterForm: FormGroup;
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
    this.confirmationRegisterForm = this.fb.group({
      email: ['vasile.enachi@student.tuiasi.ro', [Validators.required, Validators.email]],
      code: ['', [Validators.required]]
    });
    this.activatedRouter.queryParams.subscribe(params => {
      if (params.email) {
        this.confirmationRegisterForm.patchValue({
          email: params.email
        })
      }
    })
  }

  get f() { return this.confirmationRegisterForm.controls; }

  onSubmit(): void {
    this.errorMsg = '';
    this.submitted = true;

    if (this.confirmationRegisterForm.invalid) {
      this.translateService.get(this.languageService.INVALID_DATA).toPromise().then((result) => {
        this.toastr.error(result)
      })
      return;
    } else {
      this.authService.confirmSignUp(this.f.email.value, this.f.code.value)
        .then((user) => {
          console.log(user);
          this.translateService.get(this.languageService.SUCCESSFUL_CONFIRMATION).toPromise().then((result) => {
            this.toastr.success(result);
          })
          this.router.navigateByUrl("auth/login");
          //this.successful = true;

        })
        .catch((err) => {
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

    this.authService.resendSignUp(this.f.email.value).then((user) => {
      console.log(user);
      this.translateService.get(this.languageService.INFO_CODE_RESENT).toPromise().then((result) => {
        this.toastr.success(result);
      })
    })
      .catch((err) => {
        this.errorMsg = err.message;
        this.toastr.error(err.message);
      })
  }
}
