import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Contacts } from './contacts.model';
import { TranslateService } from '@ngx-translate/core';
import {User} from "../../../core/services/api.service";
import {Observable, Subscription} from "rxjs";
import {ContactsService} from "../../../core/services/contacts.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
/**
 * Tab-contacts component
 */
export class ContactsComponent implements OnInit {
  @Input() friendsArray: Array<User> = [];
  private eventsSubscription: Subscription;
  @Input() events: Observable<User>;
  @Output() goToConversationEvent = new EventEmitter<string>();

  contacts: Contacts[];
  contactsList: any;
  contactFilterModel: string;

  constructor(
    private modalService: NgbModal,
    public translate: TranslateService,
    private contactsService: ContactsService
    ) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((friend) => {
      const result = this.friendsArray.find((user) => user.id === friend.id);
      if (typeof result === "undefined") {
        this.friendsArray.push(friend);
      }
      this.processContacts();
    });
    this.processContacts();
  }

  processContacts() {
    this.contactsList = this.contactsService.getUsersSorted(this.friendsArray);
  }


  /**
   * Contacts modal open
   * @param content content
   */
  // tslint:disable-next-line: typedef
  openContactsModal(content) {
    this.modalService.open(content, { centered: true });
  }

  goToConversation(userId: string) {
    this.goToConversationEvent.emit(userId);
  }

  filterContacts() {
    this.contactsList = this.contactsService.getUsersSorted(
      this.friendsArray.filter(user => user.email.includes(this.contactFilterModel) || user.name.includes(this.contactFilterModel))
    );
  }
}
