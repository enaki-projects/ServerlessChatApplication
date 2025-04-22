import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";
import {AccountService} from "../../core/services/account.service";
import {BusyService} from "../../core/services/effects/busy.service";
import {APIService, Status} from "../../core/services/api.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../core/services/language.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  year: number = new Date().getFullYear();

  listLang = [
    { text: 'tooltip.language.en', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'tooltip.language.ro', flag: 'assets/images/flags/romania.png', lang: 'ro' },
    { text: 'tooltip.language.ru', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  submitted = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private accountService: AccountService,
    private apiService: APIService,
    private loadingService: BusyService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['dipper@student.tuiasi.ro', [Validators.required, Validators.email]],
      password: ['1qaz2wsx', [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.errorMsg = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.translateService.get(this.languageService.INVALID_DATA).toPromise().then((result) => {
        this.toastr.error(result)
      })
      return;
    } else {
      this.loadingService.busy();
      this.authService.signIn(this.f.email.value, this.f.password.value)
        .then((user) => {
          this.apiService.UpdateUserStatus(Status.online).then(() => {
            console.log(user);
            this.accountService.setUser();
            this.translateService.get(this.languageService.SUCCESSFUL_LOGIN).toPromise().then((result) => {
              this.toastr.success(result);
            })
            this.router.navigateByUrl(this.returnUrl);
          }).finally(() => {
            this.loadingService.idle();
          });
        })
        .catch((err) => {
          console.log(err.name)
          switch (err.name) {
            case "NotAuthorizedException":
              this.translateService.get(this.languageService.SERVER_AUTHORIZATION).toPromise().then((result) => {
                this.errorMsg = result;
                this.toastr.error(result);
              })
              break;
            case "UserNotConfirmedException":
              this.translateService.get(this.languageService.SERVER_USER_NOT_CONFIRMED).toPromise().then((result) => {
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
        }).finally(() => {
          this.loadingService.idle();
        });

    }
  }
}
