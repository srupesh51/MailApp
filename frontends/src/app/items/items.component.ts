import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { MailService } from '../services/mail.service';
import { AlertService } from '../services/alert.service';
import { SocketioService } from '../services/socketio.service';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  mailID;
  mails;
  loading = false;
  socket;
  constructor(private route: ActivatedRoute, private router: Router, private mailService: MailService,
  private alertService: AlertService, private socketService: SocketioService) {
    this.route.params.subscribe(params => {
      this.mailID = params['id'];
       // In a real app: dispatch action to load the details here.
    });
    this.socket = socketService.getSocketConnection();
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
      this.socket.on('MAIL_RECV', (msg) => {
        if(msg.Messages !== undefined && msg.Messages.length > 0) {
            msg.Messages[msg.Messages.length-1].Date = moment(msg.Messages[msg.Messages.length-1].Date).format('YYYY-MM-DD hh:mm:ss A');
        }
        if(this.mails !== undefined && this.mails.length > 0) {
          if(parseInt(msg.MailID) === parseInt(this.mailID)) {
                this.mails.push({...msg.Messages[msg.Messages.length-1]
              });
           }
        }
      });
  }
}
