import { Injectable } from '@angular/core';
import {Message} from "./api.service";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor() { }

  fromToday(message: Message): boolean {
    const TODAY = moment();
    return moment(message.createdAt).isSame(TODAY, "day");
  }

  fromYesterday(message: Message): boolean {
    const YESTERDAY = moment().subtract(1, "day");
    return moment(message.createdAt).isSame(YESTERDAY, "day");
  }

  isDayDifference(message1: Message, message2: Message) {
    return !moment(message1.createdAt).isSame(moment(message2.createdAt), "day");
  }

  formatDate(message: Message, lang="en") {
    return moment(message.createdAt).locale(lang).format('dddd, MMMM Do YYYY'); // 'today Sunday'
  }
}
