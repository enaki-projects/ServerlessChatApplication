import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {chat, groups} from './data';
import {Chats, Groups} from './chat.model';
import * as mime from 'mime';

import {Lightbox} from 'ngx-lightbox';
//import { AuthenticationService } from '../../core/services/auth.service';
//import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
// Date Format
import {DatePipe} from '@angular/common';
import {AccountService} from "../../core/services/account.service";
import {
  APIService,
  ConversationNotification,
  Message,
  ModelSortDirection,
  Status,
  User,
  UserConversation
} from "../../core/services/api.service";
import {CustomApiService, ExtendedConversation} from "../../core/services/custom-api.service";
import {MessageService} from "../../core/services/message.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../core/services/auth.service";
import {Subject} from "rxjs";
import {BusyService} from "../../core/services/effects/busy.service";
import {FileService} from "../../core/services/file.service";
import {Storage} from "aws-amplify";
import {ContactsService} from "../../core/services/contacts.service";
import {LanguageService} from "../../core/services/language.service";

const LIMIT = 10;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

/**
 * Chat-component
 */
export class IndexComponent implements OnInit, OnDestroy {
  readonly CHAT_SPINNER = "chat_spinner"
  readonly FRIEND_LIST_SPINNER = "friend_list_spinner"
  readonly MESSAGE_DELETED_MSG = "chat.tabs.chats.messages.type.deleted"
  readonly ATTACHMENT_SENT_MSG = "Attachment sent"

  contactsEventsSubject: Subject<User> = new Subject<User>();

  activetab = 2;
  chat: Chats[];
  groups: Groups[];
  formData!: FormGroup;
  @ViewChild('scrollRef') scrollRef:any;
  emoji = '';
  isReplyMessage = false;
  isgroupMessage = false;
  mode: string | undefined;
  public isCollapsed = true;

  lang: string;
  messageTimeFormat: string;

  images: { src: string; thumb: string; caption: string }[] = [];

  senderName:any;
  senderProfile:any;

  currentUser: User;
  currentUserImgSrc: string;

  friendUser: User;
  friendUserImgSrc: string;

  subscriptions = [];
  conversations: Array<ExtendedConversation | null>;
  // Friend's UserConversation for the specific conversationId
  conversationFriendDetailsMap: Map<string, UserConversation> = new Map<string, UserConversation>();

  friendsStatusMap: Map<string, Status> = new Map<string, Status>();
  friendsUserImgSrcMap: Map<string, string> = new Map<string, string>();

  // Current user's UserConversation for the specific conversationId
  conversationDetailsMap: Map<string, UserConversation> = new Map<string, UserConversation>();
  conversationLatestMessageMap: Map<string, Message> = new Map<string, Message>();
  friendIds: Array<string> = [];
  friendsArray: Array<User> = [];
  selectedConversationId: string = null;
  selectedConversationMessages: Array<Message>;
  selectedMessagesUrlOfMediaType: Map<string, string> = new Map<string, string>();
  selectedMessagesOfMediaMetadata: Map<string, any> = new Map<string, any>();
  myFirstLetter = "*";
  friendFirstLetter = "*";
  private selectedConversationNextToken: string = null;

  constructor(//private authFackservice: AuthfakeauthenticationService,
              //private authService: AuthenticationService,
              private router: Router,
              private messageService: MessageService,
              private authService: AuthService,
              private accountService: AccountService,
              private apiService: APIService,
              private fileService: FileService,
              private contactsService: ContactsService,
              private customApiService: CustomApiService,
              private toastr: ToastrService,
              public translate: TranslateService,
              public languageService: LanguageService,
              private modalService: NgbModal,
              private offcanvasService: NgbOffcanvas,
              private loadingService: BusyService,
              public formBuilder: FormBuilder, private datePipe: DatePipe,
              private lightbox: Lightbox) {}

  ngOnInit(): void {
    console.log('[IndexComponent] - OnInit');
    document.body.setAttribute('data-layout-mode', 'light');

    // Validation
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    const user = window.localStorage.getItem('currentUser');
    this.senderName = "admin"
    this.senderProfile = 'assets/images/users/avatar-1.jpg'
    this.chat = chat;
    this.groups = groups;
    this.lang = this.translate.currentLang;
    this.messageTimeFormat = 'shortTime';
    this.onListScroll();

    this.selectedConversationMessages = [];

    const subscription1 = this.accountService.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        this.loadCurrentUser(currentUser);
      }
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

  hasUserImageByConversationId(conversationId: string) {
    return this.hasUserImage(this.conversationFriendDetailsMap.get(conversationId).user)
  }

  getUserImageSrcByConversationId(conversationId: string) {
    return this.friendsUserImgSrcMap.get(this.conversationFriendDetailsMap.get(conversationId).user.id)
  }

  getUserFirstLetter(user: User) {
    return this.accountService.getUserFirstLetter(user);
  }

  loadCurrentUser(currentUser: User): void {
    console.log("loadCurrentUser(): ", currentUser);

    this.currentUser = currentUser;
    this.cleanUp();

    this.subscriptions.push(
      this.apiService.OnNotifyUserOfConversationCreationListener(currentUser.id).subscribe((provider) => {
        const conversationNotification: ConversationNotification = provider.value.data.onNotifyUserOfConversationCreation;
        this.customApiService.GetConversation(conversationNotification.conversationId)
          .then((extendedConversation) => {
            this.toastr.info("A user added you to their conversations")
            this.processConversation(extendedConversation);
          })
      })
    );
    this.subscriptions.push(
      this.apiService.OnUpdateUserConversationForNotificationListener(currentUser.id).subscribe((provider) => {
        const conversationNotification: UserConversation = provider.value.data.onUpdateUserConversationForNotification;
        console.log(conversationNotification);

        // Fetch latest message
        this.apiService.GetConversation(conversationNotification.conversationId).then((conversation) => {
          this.conversationLatestMessageMap.set(conversationNotification.conversationId, conversation.lastMessage);
        })

        // Only if is not selected
        if (!(this.selectedConversationId && this.selectedConversationId === conversationNotification.conversationId)) {
          this.conversationDetailsMap.set(conversationNotification.conversationId, conversationNotification);
          if (conversationNotification.noUnread > 0) {
            this.accountService.playAudio();
          }
        } else {
          this.conversationDetailsMap.get(conversationNotification.conversationId).noUnread = 0;
        }
      })
    );

    this.loadUserConversations();
  }

  cleanUp() {
    console.log("CleanUp");
    this.conversations = [];
    this.friendIds = [];
    this.friendsArray = [];
    this.conversationFriendDetailsMap.clear();
    this.friendsStatusMap.clear();
    this.forwardUserIdsToConversationIds.clear();
    this.messageToForward = null;
    this.closeReplay();
  }

  alignRight(message: Message): boolean {
    return message.authorId === this.currentUser.id;
  }

  processFirstLetters() {
    this.myFirstLetter = this.currentUser.email.charAt(0);
    this.friendFirstLetter = this.conversationFriendDetailsMap.get(this.selectedConversationId).user.email.charAt(0);
  }

  markConversationAsRead(conversationId) {
    const userConversationId = this.conversationDetailsMap.get(conversationId).id;
    this.apiService.UpdateUserConversationForNotification(userConversationId, true)
      .catch((err) => {
        console.log(err);
      })
  }

  processConversation(conversation: ExtendedConversation) {
    // subscribe to oncoming messages
    let subscription = this.apiService.OnMessageMutationListener(conversation.id).subscribe((provider) => {
      const message: Message = provider.value.data.onMessageMutation;
      if (!(this.selectedConversationId === message.conversationId && message.authorId !== this.currentUser.id )) {
        return;
      }
      switch (message.type) {
        case "deleted":
          this.updateMessageFromInbox(message);
          break;
        default:
          this.pushMessageToInbox(message);
          this.onListScroll();
          break;
      }
      this.markConversationAsRead(this.selectedConversationId);
    });
    this.subscriptions.push(subscription);

    // Update Conversation map with the latest message
    this.conversationLatestMessageMap.set(conversation.id, conversation.lastMessage);

    for (let item of conversation.userConversations.items) {
      if (item.user.id !== this.currentUser.id) {  // friendId
        this.friendIds.push(item.user.id);
        this.conversationFriendDetailsMap.set(conversation.id, item);
        this.friendsStatusMap.set(item.user.id, item.user.status);

        this.accountService.getImgSrc(item.user.cognitoIdentityId, item.user.avatarPath).then((imgSrc: string) => {
          this.friendsUserImgSrcMap.set(item.user.id, imgSrc);

          // MOVED FROM THE BEGINNING OF THE FUNCTION, IN ORDER TO FIRST LOAD THE IMAGE
          this.conversations.push(conversation)
        })

        if (this.friendUser && this.friendUser.id === item.user.id) {
          this.friendUser.status = item.user.status;
          this.friendUserImgSrc = this.friendsUserImgSrcMap.get(this.friendUser.id);
        }

        //notify contacts component
        this.contactsEventsSubject.next(item.user);
        this.friendsArray.push(item.user);
        this.subscriptions.push(
          this.apiService.OnUpdateUserStatusListener(item.user.id).subscribe((provider) => {
            const user = provider.value.data.onUpdateUserStatus;
            this.friendsStatusMap.set(user.id, user.status);

            if (this.friendUser && this.friendUser.id === user.id) {
              this.friendUser.status = user.status;
            }
          })
        )

      } else { //myId
        this.conversationDetailsMap.set(conversation.id, item);
      }
    }
  }

  loadUserConversations(nextToken = null): void {
    console.log("Call loadUserConversations with token: ", nextToken);
    this.loadingService.busy();
    this.customApiService.ConversationsWithUsersByUserId(this.currentUser.id, null, null, null, nextToken )
      .then((result) => {
        console.log(result);
        result.items.forEach((userConversation) => {
          // iterate through user conversations
          this.processConversation(userConversation.conversation);
        })
        if (result.nextToken) {
          console.log("Calling again loadUserConversations. nextToken: ", result.nextToken)
          this.loadUserConversations(result.nextToken)
        } else {
          console.log("Current User: ", this.currentUser);
          console.log("Conversation Details Map: ", this.conversationDetailsMap);
          console.log("Friend Conversation Details Map: ", this.conversationFriendDetailsMap);
          console.log("All conversations array: ", this.conversations);
          console.log("Friends Status Map: ", this.friendsStatusMap);
          console.log("Friends Img Src Map: ", this.friendsUserImgSrcMap);
        }
    })
      .finally(() => {
        this.loadingService.idle();
      })
  }

  showConversation(event: any, conversationId: string) {
    var removeClass = document.querySelectorAll('.chat-user-list li');
    removeClass.forEach((element: any) => {
      element.classList.remove('active');
    });

    document.querySelector('.user-chat').classList.add('user-chat-show')
    document.querySelector('.chat-welcome-section').classList.add('d-none');
    document.querySelector('.user-chat').classList.remove('d-none');
    if (event) {
      event.target.closest('li').classList.add('active');
    }

    this.selectedConversationId = conversationId;
    this.markConversationAsRead(this.selectedConversationId);

    this.friendUser = this.conversationFriendDetailsMap.get(this.selectedConversationId).user;
    this.friendUser.status = this.friendsStatusMap.get(this.friendUser.id);
    this.friendUserImgSrc = this.friendsUserImgSrcMap.get(this.friendUser.id);
    this.selectedConversationMessages = [];

    this.closeReplay();
    this.forwardUserIdsToConversationIds.clear();
    this.messageToForward = null;

    this.loadingService.busy(this.CHAT_SPINNER);
    this.customApiService.MessagesByConversationIdAndCreatedAt(conversationId, null, ModelSortDirection.DESC, null, LIMIT).then((result) => {
      result.items.reverse();
      //this.selectedConversationMessages = result.items;

      for (let message of result.items) {
        this.pushMessageToInbox(message);
      }
      console.log(this.selectedConversationMessages);

      this.selectedConversationNextToken = result.nextToken;
      this.onListScroll();
    })
    .finally(() => {
      this.loadingService.idle(this.CHAT_SPINNER);
    })

    this.userName = this.conversationFriendDetailsMap.get(conversationId).user.email;
    this.userStatus = "online";
    this.processFirstLetters();

    this.onListScroll();
  }

  fetchMoreMessages() {
    if (!this.selectedConversationNextToken) {
      return;
    }
    this.loadingService.busy(this.CHAT_SPINNER);
    this.customApiService.MessagesByConversationIdAndCreatedAt(this.selectedConversationId, null, ModelSortDirection.DESC, null, LIMIT, this.selectedConversationNextToken)
      .then((result) => {
        // Do not need to reverse them here, as the for logic already put each message in the array in the correct order
        // result.items.reverse();

        for (let message of result.items) {
          this.selectedConversationMessages.unshift(message);

          if (message.type !== "text") {
            let messageCognitoIdentityId =
              (message.authorId === this.currentUser.id)? this.currentUser.cognitoIdentityId: this.friendUser.cognitoIdentityId;
            this.accountService.getFileSrc(messageCognitoIdentityId, this.selectedConversationId, message.content).then((fileUrl) => {
              console.log(fileUrl)
              this.accountService.getFileMetadata(messageCognitoIdentityId, this.selectedConversationId, message.content).then((fileMetadata) => {
                console.log(fileMetadata)
                this.selectedMessagesUrlOfMediaType.set(message.id, fileUrl);
                this.selectedMessagesOfMediaMetadata.set(message.id, fileMetadata.results[0]);
                //this.selectedConversationMessages.unshift(message);
              });
            })
          } else {
            //this.selectedConversationMessages.unshift(message);
          }
        }

        //this.selectedConversationMessages.unshift(...result.items);
        this.selectedConversationNextToken = result.nextToken;
      })
      .finally(() => {
        this.loadingService.idle(this.CHAT_SPINNER);
      })
  }

  updateMessageFromInbox(message) {
    // Update conversation latest message
    if (this.conversationLatestMessageMap.get(message.conversationId).id === message.id) {
      this.conversationLatestMessageMap.set(message.conversationId, message);
    }

    // Update message from current conversation
    for (let i = 0; i < this.selectedConversationMessages.length; i++) {
      if (this.selectedConversationMessages[i].id === message.id) {
        this.selectedConversationMessages[i] = message;
      }
      if (this.selectedConversationMessages[i].replyToMessage &&
          this.selectedConversationMessages[i].replyToMessage.id === message.id) {

        this.selectedConversationMessages[i].replyToMessage = message;
      }
    }
  }

  pushMessageToInbox(message) {
    this.selectedConversationMessages.push(message);

    if (message.type !== "text") {
      let messageCognitoIdentityId =
        (message.authorId === this.currentUser.id)? this.currentUser.cognitoIdentityId: this.friendUser.cognitoIdentityId;
      this.accountService.getFileSrc(messageCognitoIdentityId, this.selectedConversationId, message.content).then((fileUrl) => {
        //console.log(fileUrl)
        this.accountService.getFileMetadata(messageCognitoIdentityId, this.selectedConversationId, message.content).then((fileMetadata) => {
          //console.log(fileMetadata)
          this.selectedMessagesUrlOfMediaType.set(message.id, fileUrl);
          this.selectedMessagesOfMediaMetadata.set(message.id, fileMetadata.results[0]);
          this.onListScroll()
        });

      })
    } else {
      this.onListScroll()
    }
  }

  sendMessage() {

    const message = this.formData.get('message')!.value.trim();
    if (!message && !this.fileToUpload) {
      return;
    }
    this.loadingService.busy(this.CHAT_SPINNER);
    this.handleFileMessage(message).then((result) => {
      this.apiService.CreateMessage(result.content, result.type, this.selectedConversationId, this.replyToMessageId).then((message) => {
        console.log(message)

        // Update current conversation with latest message details
        this.conversationLatestMessageMap.set(this.selectedConversationId, message);
        this.pushMessageToInbox(message);

        this.apiService.UpdateUserConversationForNotification(this.conversationFriendDetailsMap.get(message.conversationId).id)
          .then((result) => {
            console.log("Notified successfully", result)
          })
          .catch((err) => {
            console.error(err);
          });
        this.onListScroll();
      }).catch((err) => {
        console.error(err);
        this.toastr.error(err.message);
      }).finally(() => {
        this.closeReplay();
        this.loadingService.idle(this.CHAT_SPINNER);
      });

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null,
      });
      this.isReplyMessage = false;
      this.emoji = '';
      document.querySelector('.replyCard')?.classList.remove('show');
    })
  }

  handleFileMessage(message: string): Promise<any> {
    if (this.fileToUpload) {
      //const fileExtension = this.fileToUpload.type.split('/').pop(); // get the file extension
      const nameWithoutExtension = this.fileToUpload.name.split('.').slice(0, -1).join('.');

      let fileExtension = mime.getExtension(this.fileToUpload.type);
      if (fileExtension === null) {
        fileExtension = this.fileToUpload.name.split('.').pop()
        if (fileExtension.length > 5) {
          fileExtension = "txt"
        }
      }

      const randomId = Math.random().toString(36).substring(2, 15); // generate a random identifier
      const timestamp = Date.now(); // get the current timestamp
      const fileName = `${timestamp}-${randomId}/${nameWithoutExtension}.${fileExtension}`

      return Storage.put(`conversations/${this.selectedConversationId}/${fileName}`, this.fileToUpload, {
        level: 'protected',
        metadata: {name: this.fileToUpload.name}
      })
        .then((result) => {
          console.log(result);
          this.toastr.success("File uploaded successfully")
          let type = this.fileToUpload.type;
          this.removeImage(null);
          return {content: fileName, type: type};
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve({content: message, type: "text"});
      })
    }
  }

  ngOnDestroy(): void {
    console.log('[IndexComponent] - OnDestroy');

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.cleanUp();
  }

  /**
   * Open lightbox
   */
  openImage(messageId): void {
    // open lightbox

    let _albums:{ src: string; thumb: string; }[] = [];
    _albums.push(
      {
        src: this.selectedMessagesUrlOfMediaType.get(messageId),
        thumb: this.selectedMessagesUrlOfMediaType.get(messageId),
      }
    );

    this.lightbox.open(_albums, 0, {
      showZoom: true
    });

  }

  /**
   * Show user profile
   */
  // tslint:disable-next-line: typedef
  showUserProfile() {
    document.getElementById('profile-detail').style.display = 'block';
  }

  /**
   * Close user chat
   */
  // tslint:disable-next-line: typedef
  closeUserChat() {
    document.getElementById('chat-room').classList.remove('user-chat-show');
  }

  /**
   * Logout the user
   */
  logout() {
    /*if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else if (environment.defaultauth === 'fackbackend') {
      this.authFackservice.logout();
    }*/

    this.loadingService.busy();
    this.apiService.UpdateUserStatus(Status.offline)
      .finally(() => {
        this.authService.logout().then((result) => {
          this.cleanUp();
          this.accountService.clearStorage();
          this.router.navigate(['/auth/login']);
        }).catch((err) => {
          console.error("Auth.signOut - ", err);
        }).finally(() => {
          this.loadingService.idle();
        });
      });
  }

  /**
   * Set language
   * @param lang language
   */
  setLanguage(lang) {
    this.translate.use(lang);
    this.lang = lang;
    this.messageTimeFormat = (this.lang === 'en'? 'shortTime': 'HH:mm')
  }

  openCallModal(content) {
    this.modalService.open(content, { centered: true });
  }

  openVideoModal(videoContent) {
    this.modalService.open(videoContent, { centered: true });
  }

  /**
   * Show user chat
   */
    // tslint:disable-next-line: typedef
  userName:any = 'Doris Brown';
  userStatus:any = 'online';
  userProfile:any = 'assets/images/users/avatar-4.jpg';
  message:any;

  // Contact Search
  ContactSearch(){
    var input:any, filter:any, ul:any, li:any, a:any | undefined, i:any, txtValue:any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".chat-user-list");
    ul.forEach((item:any)=>{
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h5")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    })
  }

  // Message Search
  MessageSearch(){
    var input:any, filter:any, ul:any, li:any, a:any | undefined, i:any, txtValue:any;
    input = document.getElementById("searchMessage") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.getElementById("users-conversation");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("p")[0];
      txtValue = a?.innerText;
      if (txtValue?.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  // Filter Offcanvas Set
  onChatInfoClicked(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop = this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
      }, 0);
    }
  }

  // Emoji Picker
  showEmojiPicker = false;
  sets:any = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set:any = 'twitter';
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
    const { emoji } = this;
    const text = `${emoji}${event.emoji.native}`;
    this.emoji = text;
    this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
  }

  closeReplay(){
    //document.querySelector('.replyCard')?.classList.remove('show');
    this.replyToMessageId = null;
    this.replyToMessageContent = "";
    this.replyToMessageAuthor = "";
    this.isReplyMessage = false;
  }

  // Copy Message
  /*copyMessage(event:any){
    navigator.clipboard.writeText(event.target.closest('.chats').querySelector('.messageText').innerHTML);
    document.getElementById('copyClipBoard')?.classList.add('show');
    setTimeout(() => {
      document.getElementById('copyClipBoard')?.classList.remove('show');
    }, 1000);
  }*/

  copyMessage(message: Message){
    console.log(message);
    switch (message.type) {
      case "text": {
        navigator.clipboard.writeText(message.content);
        return;
      }
      case "deleted": {
        navigator.clipboard.writeText(this.MESSAGE_DELETED_MSG);
        return;
      }
    }
  }

  // Delete Message
  deleteMessage(messageId: string, idx: number){
    // event.target.closest('.chats').remove();

    console.log(messageId);
    this.apiService.DeleteMessage(messageId).then((message) => {
      this.updateMessageFromInbox(message);
    })
  }

  // Delete All Message
  deleteAllMessage(event:any){
    var allMsgDelete:any = document.getElementById('users-conversation')?.querySelectorAll('.chats');
    allMsgDelete.forEach((item:any)=>{
      item.remove();
    })
  }

  // Reply Message
  replyToMessageId = null;
  replyToMessageContent = "";
  replyToMessageAuthor = "";
  replyMessage($event: any, message: Message, align:any){
    this.isReplyMessage = true;
    this.replyToMessageId = message.id;
    //document.querySelector('.replyCard')?.classList.add('show');
    //var copyText = event.target.closest('.chats').querySelector('.messageText').innerHTML;
    if (message.type === "deleted") {
      this.translate.get(this.MESSAGE_DELETED_MSG).toPromise().then((result) => {
        this.replyToMessageContent = result;
      })
    }
    else if (message.type === "text") {
      this.replyToMessageContent = message.content;
    } else {
      this.replyToMessageContent = message.content.split("/").pop();
    }

    if (message.authorId === this.currentUser.id) {
      this.translate.get('chat.tabs.chats.messages.reply.you').toPromise().then((result) => {
        this.replyToMessageAuthor = result;
      })
    } else {
      this.replyToMessageAuthor = this.friendUser.name;
    }

  }

  // File Upload
  imageURL: string | undefined;
  img:any;
  fileToUpload: File = null;
  fileToUploadSrc: string;

  onFileChange(event:any) {
    const files: FileList = event.target.files;
    if (!(files && files.length > 0)) {
      return;
    }
    let fileList: any = (event.target as HTMLInputElement);
    if (fileList.length === 0) {
      return;
    }
    const tempFile = fileList.files[0];

    if (!this.fileService.isMIMETypeSupported(tempFile.type)) {
      this.toastr.error("File type not supported.");
      return;
    }

    this.fileService.isImage(tempFile).then((result) => {
      if (result.isImage) {
        this.handleImageInput(tempFile)
      } else {
        this.fileToUploadSrc = this.fileService.getFileTypeSrc(tempFile.type);
        this.fileToUpload = tempFile;
        //this.toastr.error("Only images available to send");
      }
    })
  }

  handleImageInput(imageFile: File) {
    this.fileToUpload = imageFile;
    const reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onload = () => {
      // Set the image source in your component's variable to display it
      this.fileToUploadSrc = reader.result as string;
    };
    console.log(this.fileToUpload.type);
    console.log(this.fileToUpload);
  }

  removeImage(event:any) {
    this.fileToUpload = null;

  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    switch (mode) {
      case 'light':
        document.body.setAttribute('data-layout-mode', "light");
        break;
      case 'dark':
        document.body.setAttribute('data-layout-mode', "dark");
        break;
      default:
        document.body.setAttribute('data-layout-mode', "light");
        break;
    }
  }

  isDayDifference(i: number) {
    if (i == 0) {
      return true;
    }
    return this.messageService.isDayDifference(this.selectedConversationMessages[i-1], this.selectedConversationMessages[i]);
  }

  getDay(i: number) {
    const currentMessage = this.selectedConversationMessages[i];
    if (this.messageService.fromToday(currentMessage)) {
      return "chat.tabs.chats.messages.date.today";
    }
    if (this.messageService.fromYesterday(currentMessage)) {
      return "chat.tabs.chats.messages.date.yesterday";
    }

    let processedDate = this.messageService.formatDate(currentMessage, this.lang);
    const words = processedDate.split(" ");

    return words.map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
  }

  onAddedConversation($event: ExtendedConversation) {
    console.log("onAddedConversation() - ", $event);
    this.processConversation($event);
  }

  goToConversationEvent(userId: string) {
    this.conversationFriendDetailsMap.forEach((userConversation, key) => {
      if (userConversation.user.id === userId) {
        this.activetab = 2;
      }
    })
  }

  setActiveTab(activeTab: number) {
    this.activetab = activeTab;
    if (activeTab === 4) {
      this.selectedConversationId = null;
    }
  }

   capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onImageLoad($event: any) {
    if (this.selectedConversationMessages.length <= LIMIT) {
      this.onListScroll();
    }
  }

  onPaste($event: ClipboardEvent) {
    console.log($event);
    const items = $event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          const file = new File([blob], "image.jpeg", { type: blob.type });
          this.fileService.isImage(file).then((result) => {
            if (result.isImage) {
              this.handleImageInput(file)
            } else {
              this.toastr.error("Only images available to send");
            }
          })
        }
      }
    }
  }

  getFileSize(metadata) {
    if (!metadata || typeof metadata === undefined) {
      return "... B"
    }
    if (metadata.size < 1000000) {
      return `${metadata.size / 1000} KB`
    }
    if (metadata.size < 1000000000) {
      return `${metadata.size / 1000000} MB`
    }
    return `${metadata.size / 1000000000} GB`
  }

  // FORWARD
  contactsList: any;
  messageToForward: Message;
  forwardUserIdsToConversationIds: Map<string, string> = new Map<string, string>();
  /**
   * Open center modal
   * @param centerDataModal center modal data
   */
  centerModal(centerDataModal: any, messageToForward: Message) {
    this.messageToForward = messageToForward;
    this.forwardUserIdsToConversationIds.clear();
    this.contactsList = this.contactsService.getUsersSorted(this.friendsArray);
    this.modalService.open(centerDataModal, { centered: true });
  }

  addForwarder($event: any, userId: string) {
    if ($event.target.checked) {
      for (let conversationId of this.conversationFriendDetailsMap.keys()) {
        if (this.conversationFriendDetailsMap.get(conversationId).user.id === userId) {
          this.forwardUserIdsToConversationIds.set(userId, conversationId);
          break;
        }
      }
    } else {
      this.forwardUserIdsToConversationIds.delete(userId);
    }
    console.log(this.forwardUserIdsToConversationIds);
  }

  forwardMessage() {
    if (this.messageToForward.type !== "text") {
      this.toastr.error("Only text messages supported for forwarding")
      return;
    }
    for (let conversationId of this.forwardUserIdsToConversationIds.values()) {
      this.loadingService.busy(this.CHAT_SPINNER);
      this.apiService.CreateMessage(this.messageToForward.content, "text", conversationId, null)
        .then((message) => {
          console.log(message)
          this.conversationLatestMessageMap.set(conversationId, message);

          // Update current conversation with latest message details with it is the case
          if (conversationId === this.selectedConversationId) {
            this.pushMessageToInbox(message);
            this.onListScroll();
          }

          this.apiService.UpdateUserConversationForNotification(this.conversationFriendDetailsMap.get(message.conversationId).id)
            .then((result) => {
              console.log("Notified successfully", result)
            })
            .catch((err) => {
              console.error(err);
            });
        }).catch((err) => {
          console.error(err);
          this.toastr.error(err.message);
      }).finally(() => {
        this.loadingService.idle(this.CHAT_SPINNER);
      });
    }
    console.log(this.forwardUserIdsToConversationIds);
  }

  protected readonly Status = Status;
}
