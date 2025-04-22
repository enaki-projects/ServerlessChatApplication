import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AccountService} from "../services/account.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean>| boolean  {
    return this.authService.getCurrentAuthenticatedUser()
      .then(() => {
        return true;
      })
      .catch((err) => {
        this.toastr.info('Please login first.');
        this.router.navigate(['auth/login']);
        return false;
      })
  }

}
