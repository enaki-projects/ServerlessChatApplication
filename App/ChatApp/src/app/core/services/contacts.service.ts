import { Injectable } from '@angular/core';
import {User} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor() { }


  getUsersSorted(friendsArray: Array<User>) {
    let tempMap: Map<string, User> = new Map<string, User>();
    for (let user of friendsArray) {
      tempMap.set(user.id, user);
    }
    const sorted = Array.from(tempMap.values()).sort((a, b) => a.email > b.email ? 1 : -1);

    const grouped = sorted.reduce((groups, contact) => {
      const letter = contact.email.charAt(0);
      groups[letter] = groups[letter] || [];
      groups[letter].push(contact);

      return groups;
    }, {});

    // contacts list
    return Object.keys(grouped).map(key => ({ key, contacts: grouped[key] }));
  }
}
