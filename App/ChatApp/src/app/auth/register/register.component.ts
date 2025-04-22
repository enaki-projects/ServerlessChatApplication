import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../core/services/auth.service";
import {BusyService} from "../../core/services/effects/busy.service";
import {LanguageService} from "../../core/services/language.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
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
    this.registerForm = this.fb.group({
      email: ['vasile.enachi@student.tuiasi.ro', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.errorMsg = '';
    this.submitted = true;

    if (this.f.password.value != this.f.confirmPassword.value) {
      this.translateService.get(this.languageService.IDENTICAL_PASSWORDS).toPromise().then((result) => {
        this.errorMsg = result;
        //this.toastr.error(result)
      })
      //this.toastr.error("Passwords are not identical.")
      return;
    }

    if (this.registerForm.invalid) {
      this.translateService.get(this.languageService.INVALID_DATA).toPromise().then((result) => {
        this.toastr.error(result)
      })
      return;
    }
    else {
      this.loadingService.busy();
      this.authService.signUp(this.f.email.value, this.f.password.value)
        .then((user) => {
          console.log(user);
          this.translateService.get(this.languageService.INIT_REGISTRATION).toPromise().then((result) => {
            this.toastr.info(result);
          })
          this.router.navigateByUrl("auth/confirm-register?email=" + this.f.email.value);
          //this.successful = true;
        })
        .catch((err) => {
          console.log(err)

          switch (err.name) {
            case "UsernameExistsException":
              this.translateService.get(this.languageService.SERVER_ACCOUNT_ALREADY_EXISTS).toPromise().then((result) => {
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
