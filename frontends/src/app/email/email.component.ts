import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { MailService } from '../services/mail.service';
import { AlertService } from '../services/alert.service';
import { SocketioService } from '../services/socketio.service';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})

export class EmailComponent implements OnInit {
  user = localStorage.getItem('currentUser');
  receivedMails;
  loading = false;
  submitted = false;
  socket;
  checkMails() {
    return this.receivedMails !== undefined && this.receivedMails.length > 0;
  }
  constructor(
  private router: Router,
  private mailService: MailService,
  private alertService: AlertService,
  private socketService: SocketioService
    ) {
      this.socket = socketService.getSocketConnection();
    }
  ngOnInit(): void {
    this.mailService.receivedMail(this.user)
    .pipe(first())
    .subscribe(
        data => {
          this.receivedMails = data.receivedMail;
          if(this.receivedMails !== undefined && this.receivedMails.length > 0) {
            this.receivedMails.forEach((mail) => {
              if(mail.Messages !== undefined) {
                mail.Messages.Date = moment(mail.Messages.Date).format('YYYY-MM-DD hh:mm:ss A');
              }
            });
          }
        },
        error => {
            this.alertService.error(error.error.message);
            this.loading = false;
        }
      );
      this.socket.on('MSG_RECV', (msg) => {
        if(msg.Messages !== undefined && msg.Messages.length > 0) {
            msg.Messages[msg.Messages.length-1].Date = moment(msg.Messages[msg.Messages.length-1].Date).format('YYYY-MM-DD hh:mm:ss A');
        }
        const recvMail = msg.Messages[msg.Messages.length-1].ToUser.filter((user) => {
              return user === this.user;
        });
        if(recvMail !== undefined && recvMail.length > 0) {
            if(this.receivedMails !== undefined && this.receivedMails.length > 0) {
                const mailAvailable = this.receivedMails.filter((mail) => {
                    return mail.MailID === msg.MailID;
                });
                if(mailAvailable === undefined || mailAvailable.length === 0) {
                    this.receivedMails.unshift({
                      MailID: msg.MailID,
                      Messages: msg.Messages[msg.Messages.length-1]
                  });
                } else {
                  const mailIndex = this.receivedMails.indexOf(mailAvailable[0]);
                  this.receivedMails[mailIndex].Messages = msg.Messages[msg.Messages.length-1];
                }
            } else {
              if(this.receivedMails === undefined) {
                this.receivedMails = [];
              }
              this.receivedMails.push({
                MailID: msg.MailID,
                Messages: msg.Messages[msg.Messages.length-1]
              });
            }
         }
    });
  }
  doSomething(event, name) {
    console.log(name);
    this.router.navigate(['/mail', name.MailID]);
  }
  compose() {
    this.router.navigate(['/compose']);
  }
}
