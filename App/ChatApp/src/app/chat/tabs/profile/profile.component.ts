import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {APIService, Status, User} from "../../../core/services/api.service";
import {Subscription} from "rxjs";
import {AccountService} from "../../../core/services/account.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
/**
 * Tabs-Profile component
 */
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserImgSrc: string;
  subscriptions: Subscription[] = [];

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    console.log('[ProfileComponent] - OnInit');
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const subscription1 = this.accountService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;

    });
    const subscription2 = this.accountService.currentUserImageSrc$.subscribe(currentUserImgSrc => {
      this.currentUserImgSrc = currentUserImgSrc;
    });
    this.subscriptions.push(subscription1);
    this.subscriptions.push(subscription2);
  }

  hasUserImage(user: User) {
    return this.accountService.hasUserImage(user);
  }

  getUserFirstLetter(user: User) {
    return this.accountService.getUserFirstLetter(user);
  }

  ngOnDestroy(): void {
    console.log('[ProfileComponent] - OnDestroy');
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

    protected readonly Status = Status;
}
