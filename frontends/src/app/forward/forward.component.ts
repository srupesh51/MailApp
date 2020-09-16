import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule,
FormArray, FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { MailService } from '../services/mail.service';
import { AlertService } from '../services/alert.service';
import * as EmailValidator from 'email-validator';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { SocketioService } from '../services/socketio.service';
@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css']
})
export class ForwardComponent implements OnInit {

  dynamicForm: FormGroup;
  submitted = false;
  numTickets = 0;
  loading = false;
  fromUser = localStorage.getItem('currentUser');
  selectedUserIds: number[];
  recipients = [];
  mailID;
  subject;
  selectedRecipient;
  socket;
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private mailService: MailService,
      private alertService: AlertService,
      private formBuilder: FormBuilder,
      private socketService: SocketioService) {
        this.route.params.subscribe(params => {
          console.log(params.id);
          this.mailID = params.id;
           // In a real app: dispatch action to load the details here.
        });
      this.socket = socketService.getSocketConnection();
  }

  ngOnInit(): void {
    this.dynamicForm = this.formBuilder.group({
      message_body: ['', [Validators.required]],
      subject: ['', [Validators.required]]
    });
    this.mailService.getMails(this.mailID)
    .pipe(first())
    .subscribe(
        data => {
          this.subject = data.Mails[0].Subject;
          this.dynamicForm.setValue({subject: this.subject,
          message_body: ''});
        },
        error => {
            this.alertService.error(error.error.message);
            this.loading = false;
        }
      );
  }

  onSelect(names) {
    this.alertService.clear();
    this.selectedRecipient = [];
    names.forEach((name) => {
        if(!EmailValidator.validate(name.email)) {
          this.alertService.error('The Email '+name.email+' is not valid. Please enter a valid email');
          return;
        }
        let flag = false;
        if(this.recipients !== undefined && this.recipients.length > 0) {
           const isRecipient = this.recipients.filter((recipient) => {
              return recipient === name.email;
           });
           flag = isRecipient !== undefined && isRecipient.length > 0;
        }
        if(!flag) {
          this.selectedRecipient.push(name.email);
        }
    });
  }
  get f() { return this.dynamicForm.controls; }
  addCustomUser = (term) => ({id: term, email: term});
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
        return;
    }
    if((this.selectedRecipient !== undefined && this.selectedRecipient.length === 0) || (this.selectedRecipient === undefined)) {
      this.alertService.error('Please Enter Atleast one Recipient before proceeding');
      return;
    }
    console.log(this.selectedRecipient);
    const formValue = this.dynamicForm.value;
    const messageBody = formValue.message_body;
    const subject = formValue.subject;
    this.mailService.forwardMail(this.fromUser, this.selectedRecipient, subject,
     messageBody, this.mailID)
    .pipe(first())
    .subscribe(
        data => {
          this.socket.emit('MSG_SENT', data.Mails);
          this.socket.emit('MAIL_SENT', data.Mails);
          this.alertService.success('Mail Successfully Sent', true);
          this.router.navigate(['/email']);
        },
        error => {
            this.alertService.error(error.error.message);
            this.loading = false;
        }
      );
  }

}
