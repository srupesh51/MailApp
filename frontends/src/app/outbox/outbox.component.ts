import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { MailService } from '../services/mail.service';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.css']
})
export class OutboxComponent implements OnInit {
  user = localStorage.getItem('currentUser');
  sentMails;
  loading = false;
  submitted = false;
  constructor(private router: Router, private mailService: MailService,
  private alertService: AlertService) {

  }
  checkMails() {
    return this.sentMails !== undefined && this.sentMails.length > 0;
  }
  doSomething(event, name) {
    console.log(name);
    this.router.navigate(['/sent', name.MailID]);
  }
  ngOnInit(): void {
    console.log(this.user);
    this.mailService.sentMail(this.user)
    .pipe(first())
    .subscribe(
        data => {
          this.sentMails = data.sentMail;
          if(this.sentMails !== undefined && this.sentMails.length > 0) {
              this.sentMails.forEach(element => {
                if(element.Messages !== undefined) {
                  element.Messages.Date = moment(element.Date).format('YYYY-MM-DD hh:mm:ss A');
                }
              });
            }
        },
        error => {
            this.alertService.error(error.error.message);
            this.loading = false;
        }
      );
  }

}
