import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from './../../environments/environment';
const BACKEND_API_URL = environment.apiURL + '/mails';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }

  composeMail(from: string, to: Array<string>, subject: string, message_body: string, userId: Number) {
        return this.http.post<any>(BACKEND_API_URL + '/compose/' + userId,
        {from: from, to: to,  subject: subject, message_body: message_body});
  }

  replyMail(from: string, to: Array<string>, subject: string, message_body: string, mailID: Number) {
      return this.http.post<any>(BACKEND_API_URL + '/reply/' + mailID, {from: from, to: to,  subject: subject, message_body: message_body});
  }

  replyAllMail(from: string, to: Array<string>, subject: string, message_body: string, mailID: Number) {
      return this.http.post<any>(BACKEND_API_URL + '/reply-all/' + mailID, {from: from, to: to,  subject: subject, message_body: message_body});
  }

  forwardMail(from: string, to: Array<string>, subject: string, message_body: string, mailID: Number) {
      return this.http.post<any>(BACKEND_API_URL + '/forward/' + mailID, {from: from, to: to,  subject: subject, message_body: message_body});
  }

  receivedMail(received_from: string) {
      return this.http.get<any>(BACKEND_API_URL + '/received/' + received_from);
  }

  sentMail(sent_from: string) {
      return this.http.get<any>(BACKEND_API_URL + '/sent/' + sent_from);
  }

  getMails(mailID: Number) {
    return this.http.get<any>(BACKEND_API_URL + '/' + mailID);
  }

  getOutboxMails(mailID: Number, email: string) {
    return this.http.post<any>(BACKEND_API_URL + '/outbox/' + mailID, {email: email});
  }

}
