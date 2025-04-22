import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AccountService} from "../../../core/services/account.service";
import {APIService, Status, User} from "../../../core/services/api.service";
import {ToastrService} from "ngx-toastr";
import { Auth, Storage } from 'aws-amplify';
import {FileService} from "../../../core/services/file.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
/**
 * Tabs-settings component
 */
export class SettingsComponent implements OnInit, OnDestroy {
  userName:any;
  subscriptions: Subscription[] = [];
  currentUser: User;
  currentUserImgSrc: string;

  constructor(
    private accountService: AccountService,
    private fileService: FileService,
    private apiService: APIService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    console.log('[SettingsComponent] - OnInit');
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const subscription1 = this.accountService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
      this.userName = currentUser.name;
    });
    const subscription2 = this.accountService.currentUserImageSrc$.subscribe(currentUserImgSrc => {
      this.currentUserImgSrc = currentUserImgSrc;
    });
    this.subscriptions.push(subscription1);
    this.subscriptions.push(subscription2);
  }

  // User Profile Update
  imageURL: string | undefined;
  fileChange(event:any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file)
    console.log(file);
    if (file) {
      this.fileService.isImage(file).then(result => {
        if (result.isImage) {
          Storage.put(`avatar/${this.currentUser.id}.${result.extension}`, file, { level: 'protected' }).then((result) => {
            this.toastr.success("Profile Picture updated successfully")
            console.log(result);
            Storage.list("", {level: 'protected'}).then((result) => {
              console.log(result);
            })
            Storage.get(`${this.currentUser.avatarPath}`, {level: 'protected', identityId: this.currentUser.cognitoIdentityId}).then(result => {
              console.log(result);
            })
            this.currentUser.avatarPath = result.key;
            this.accountService.setImage(this.currentUser.cognitoIdentityId, this.currentUser.avatarPath);
          });
        } else {
          this.toastr.error("The file is not an image.")
          // The file is not an image
        }
      });
    }
  }

  // User Name Update
  edit_userName() {
    this.userName = this.currentUser.name;
    document.getElementById("user_name").classList.toggle("visually-hidden");
    document.getElementById("user_name_edit").classList.toggle("visually-hidden");
    document.getElementById("edit-user-name").classList.toggle("visually-hidden");
  }
f
  // User Name Update
  userNameChange() {
    this.apiService.UpdateUserName(this.userName).then((result: User) => {
      this.currentUser.name = result.name;
      this.toastr.info("User name change successfully")
    }).catch((err) => {
      console.log(err);
      this.toastr.info("Error in changing the user name");

    })
    document.getElementById("user_name").classList.toggle("visually-hidden");
    document.getElementById("edit-user-name").classList.toggle("visually-hidden");
    document.getElementById("user_name_edit").classList.toggle("visually-hidden");
  }

  ngOnDestroy(): void {
    console.log('[SettingsComponent] - OnDestroy');

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  setStatus(status: string) {
    this.apiService.UpdateUserStatus(status === 'online' ? Status.online: Status.away).then((result: User) => {
      this.currentUser.status = result.status;
    });
  }

    protected readonly Status = Status;
}
