import { Injectable } from '@angular/core';
import {Auth} from "aws-amplify";
import {ReplaySubject} from "rxjs";
import {User} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
  ) {
    console.log("[AuthService] - Constructor")
  }

  recovery(email: string): Promise<any> {
    return Auth.forgotPassword(email);
  }

  confirmRecovery(email: string, password: string, code: string): Promise<any> {
    return Auth.forgotPasswordSubmit(email, code, password);
  }

  signUp(email: string, password: string): Promise<any> {
      return Auth.signUp({
        username: email,
        password,
        attributes: {
          email,          // optional
          // other custom attributes
        },
        autoSignIn: { // optional - enables auto sign in after user is confirmed
          enabled: true,
        }
      });
  }

  confirmSignUp(email: string, code: string): Promise<any> {
    return Auth.confirmSignUp(email, code);
  }

  signIn(email: string, password: string): Promise<any> {
    return Auth.signIn(email, password)
  }

  logout() {
    return Auth.signOut();
  }

  resendSignUp(email: string): Promise<any> {
    return Auth.resendSignUp(email);
  }

  getCurrentUserInfo(): Promise<any> {
    return Auth.currentUserInfo()
  }

  getCurrentAuthenticatedUser(): Promise<any> {
    return Auth.currentAuthenticatedUser();
  }

  displayInfoCurrentSession() {
    Auth.currentUserInfo().then(curUser => {
      console.log("CurrentUserInfo")
      console.log(curUser)
      Auth.currentSession().then(session => {
        console.log("currentSession")
        console.log(session)
        Auth.currentCredentials().then(credentials => {
          console.log("credentials")
          console.log(credentials)
          Auth.currentUserCredentials().then(userCredentials => {
            console.log("userCredentials")
            console.log(userCredentials)
          })
        })
      })
    })
  }
}
