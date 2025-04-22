import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {APIService, User} from "../../../core/services/api.service";
import {AccountService} from "../../../core/services/account.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";
import * as SimpleBar from 'simplebar';
import {CustomApiService} from "../../../core/services/custom-api.service";
import {BusyService} from "../../../core/services/effects/busy.service";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit, OnDestroy {
  @Output() newConversationEvent = new EventEmitter<string>();
  @Input() friendIds;
  searchForm: FormGroup;
  foundUsers: Array<User> = [];
  foundUsersImgSrcMap: Map<string, string> = new Map<string, string>();

  modalUser: User;
  currentUser: User;
  subscriptions: Subscription[] = [];
  nextToken: string = null;
  filter = {};
  fetching = false;
  LIMIT = 10;
  readonly USER_SEARCH_SPINNER = "user_search_spinner"

  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    private customApiService: CustomApiService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private loadingService: BusyService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    console.log('[UserSearchComponent] - OnDestroy');

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  loadCurrentUser(): void {
    const subscription = this.accountService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
    this.subscriptions.push(subscription);
  }

  hasUserImage(user: User) {
    return this.accountService.hasUserImage(user);
  }

  getUserFirstLetter(user: User) {
    return this.accountService.getUserFirstLetter(user);
  }

  get f() { return this.searchForm.controls; }

  initializeForm(): void {
    this.searchForm = this.fb.group({
      email: ['', []],
      emailOperator: ['eq', [Validators.required]],
      emailEnable: [false],
      name: ['', []],
      nameOperator: ['eq', [Validators.required]],
      nameEnable: [false]
    });
    this.foundUsers = [];
    this.nextToken = null;
  }

  onSubmit(): void {
    this.filter = {}
    if (this.f.emailEnable.value) {
      const emailOperator = this.f.emailOperator.value;
      const emailValue = this.f.email.value;
      this.filter["email"] = {}
      this.filter["email"][emailOperator] = emailValue
    }
    if (this.f.nameEnable.value) {
      const nameOperator = this.f.nameOperator.value;
      const nameValue = this.f.name.value;
      this.filter["name"] = {}
      this.filter["name"][nameOperator] = nameValue
    }

    this.loadingService.busy(this.USER_SEARCH_SPINNER);
    let foundUsersPromises = []
    this.apiService.ListUsers(null, this.filter, this.LIMIT)
      .then((result) => {
        this.nextToken = result.nextToken;
        this.foundUsers = result.items.filter((user) => user.id !== this.currentUser.id);
        this.foundUsers.forEach((user) => {
          foundUsersPromises.push(
            this.accountService.getImgSrc(user.cognitoIdentityId, user.avatarPath)
          )
        })
      })
      .finally(() => {
        Promise.all(foundUsersPromises).then((promisesValues) => {
          console.log(promisesValues);
          for (let idx = 0; idx < this.foundUsers.length; ++idx) {
            this.foundUsersImgSrcMap.set(this.foundUsers[idx].id, promisesValues[idx]);
          }
          this.loadingService.idle(this.USER_SEARCH_SPINNER);
        })
      })
  }

  fetchMore() {
    if (this.nextToken) {
      this.fetching = true;
      this.loadingService.busy(this.USER_SEARCH_SPINNER);
      let foundUsersPromises = []

      this.apiService.ListUsers(null, this.filter, this.LIMIT, this.nextToken)
        .then((result) => {
          this.nextToken = result.nextToken;

          const newUsers = result.items.filter((user) => user.id !== this.currentUser.id);
          newUsers.forEach((user) => {
            foundUsersPromises.push(
              this.accountService.getImgSrc(user.cognitoIdentityId, user.avatarPath)
            )
          })
          this.foundUsers.push(...newUsers);
          return newUsers;
        })
        .then((newUsers) => {
          console.log(newUsers)
          Promise.all(foundUsersPromises).then((promisesValues) => {
            console.log(promisesValues);
            for (let idx = 0; idx < newUsers.length; ++idx) {
              this.foundUsersImgSrcMap.set(newUsers[idx].id, promisesValues[idx]);
            }
          })
        })
        .finally(() => {
            this.foundUsers = [...this.foundUsers];
            this.fetching = false;
            this.loadingService.idle(this.USER_SEARCH_SPINNER);
        })
    }
  }

  resetForm() {
    this.initializeForm();
  }

  setEmailOperator(operator: string) {
    this.f.emailOperator.setValue(operator);
  }

  setNameOperator(operator: string) {
    this.f.nameOperator.setValue(operator);
  }

  openContactsModal(content, user: User) {
    this.modalUser = user;
    this.modalService.open(content, { centered: true });
  }

  addConversation(user: User) {
    this.loadingService.busy();
    this.customApiService.CreateConversation(user.id)
      .then((result:any) => {
        this.newConversationEvent.emit(result);
        this.toastr.success("Conversation Added Successfully");

        //notify user
        this.apiService.NotifyUserOfConversationCreation(user.id, result.id).then((result) => {
        })
      })
      .catch((err) => {
        console.error(err);
        if (err.errors) {
          this.toastr.error(err.errors[0].message)
        }
      })
      .finally(() => {
        this.loadingService.idle();
        this.modalService.dismissAll();
      }
    )
  }

  onYReachEnd($event: any) {
  }
}
