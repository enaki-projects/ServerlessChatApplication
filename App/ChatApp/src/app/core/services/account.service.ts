import {Injectable} from '@angular/core';
import {APIService, Status, User} from "./api.service";
import {ReplaySubject} from "rxjs";
import {AuthService} from "./auth.service";
import {Storage} from "aws-amplify";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserImageSrcSource = new ReplaySubject<string>(1);
  currentUserImageSrc$ = this.currentUserImageSrcSource.asObservable();

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  audio: any;

  constructor(
    private apiService: APIService,
    private authService: AuthService,
  ) {
    console.log("[AccountService] - Constructor");
    this.initUAudio();
    this.fetchUser();
  }

  private initUAudio(){
    this.audio = new Audio();
    this.audio.src = "assets/audio/message_1.mp3";
    this.audio.load();
  }

  playAudio() {
    this.audio.play();
  }

  clearStorage() {
    this.currentUserSource.next(null);
    sessionStorage.removeItem('user');
  }

  updateCognitoIdentityId() {
    return this.authService.getCurrentUserInfo()
      .then(currentUser => this.apiService.UpdateCognitoIdentityId(currentUser.id))
  }

  setUser() {
    this.apiService.Me()
    .then((currentUser: User) => {
      console.log(currentUser)
      if (!currentUser.cognitoIdentityId) {
        this.authService.getCurrentUserInfo().then(userInfo => {
          currentUser.cognitoIdentityId = userInfo.id;
          console.log(userInfo)
          this.updateCognitoIdentityId().then(status => {
            console.log(status);
            sessionStorage.setItem('user', JSON.stringify(currentUser));
            this.currentUserSource.next(currentUser);
            this.setImage(currentUser.cognitoIdentityId, currentUser.avatarPath);
          });
        })
      } else {
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        this.currentUserSource.next(currentUser);
        this.setImage(currentUser.cognitoIdentityId, currentUser.avatarPath);
      }
    })
  }

  setImage(cognitoIdentityId, avatarPath) {
    this.getImgSrc(cognitoIdentityId, avatarPath).then((result: string) => {
      console.log("For cognitoIdentityId " + cognitoIdentityId + "with have the url " + result)
      this.currentUserImageSrcSource.next(result);
    })
  }

  getImgSrc(cognitoIdentityId, avatarPath) {
    if (!avatarPath) { // for mocked users
      return new Promise((resolve, reject) => {
        resolve("assets/images/users/user.png");
      });
    }
    else if (avatarPath.includes("assets/images")) { // for mocked users
      return new Promise((resolve, reject) => {
        resolve(avatarPath);
      });
    } else {
      return Storage.get(avatarPath, {level: 'protected', identityId: cognitoIdentityId});
    }
  }

  getFileSrc(cognitoIdentityId, conversationId, fileName) {
      return Storage.get(`conversations/${conversationId}/${fileName}`, {level: 'protected', identityId: cognitoIdentityId});
  }

  getFileMetadata(cognitoIdentityId, conversationId, fileName) {
    return Storage.list(`conversations/${conversationId}/${fileName}`, {level: 'protected', identityId: cognitoIdentityId});
  }

  fetchUser(): User {
    let result = JSON.parse(localStorage.getItem('user')) || null;
    if (!result) {
      this.authService.getCurrentAuthenticatedUser()
        .then((currentUserInfo) => {
          this.setUser();
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      this.currentUserSource.next(result);
    }
    return result;
  }

  hasUserImage(user: User) {
    return user && (user.avatarPath) && (user.cognitoIdentityId || user.avatarPath.includes("assets/images"));
  }

  getUserFirstLetter(user: User) {
    if (!user) {
      return "-"
    }
    if (user.name) {
      return user.name.split(" ").map(token => token.charAt(0).toUpperCase()).join()
    }
    return user.email.charAt(0).toUpperCase()
  }
}
