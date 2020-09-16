import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { MailService } from '../services/mail.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-outbox-items',
  templateUrl: './outbox-items.component.html',
  styleUrls: ['./outbox-items.component.css']
})
export class OutboxItemsComponent implements OnInit {
  mailID;
  mails;
  loading = false;
  constructor(private route: ActivatedRoute, private router: Router, private mailService: MailService,
  private alertService: AlertService) {
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.mailID = params['id'];
       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnInit(): void {
    this.mailService.getMails(this.mailID)
    .pipe(first())
    .subscribe(
        data => {
          this.mails = data.Mails;
          if(this.mails !== undefined && this.mails.length > 0) {
            console.log(this.mails);
              this.mails.forEach(element => {
                element.Date = moment(element.Date).format('YYYY-MM-DD hh:mm:ss A');
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
