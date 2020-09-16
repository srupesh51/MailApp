import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { MailService } from '../services/mail.service';
import { UserService } from '../services/user.service';
import * as EmailValidator from 'email-validator';
import { SocketioService } from '../services/socketio.service';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css']
})
export class ComposeComponent implements OnInit {
    dynamicForm: FormGroup;
    submitted = false;
    loading = false;
    fromUser = localStorage.getItem('currentUser');
    recipients = [];
    selectedRecipient;
    userList;
    socket;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private mailService: MailService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private socketService: SocketioService
  ) {
      this.socket = socketService.getSocketConnection();
    }

    ngOnInit(): void {
      this.dynamicForm = this.formBuilder.group({
        emails: new FormArray([]),
        message_body: ['', [Validators.required]],
        subject: ['', [Validators.required]]
      });

    }

    get f() { return this.dynamicForm.controls; }

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
        const formValue = this.dynamicForm.value;
        const subject = formValue.subject;
        const messageBody = formValue.message_body;
        this.userService.getUser(this.fromUser)
        .pipe(first())
        .subscribe(
            data => {
              const userId = data.result.user_id;
              this.mailService.composeMail(this.fromUser, this.selectedRecipient,
                subject, messageBody, userId)
              .pipe(first())
              .subscribe(
                  data => {
                    this.socket.emit('MSG_SENT', data.Mails);
                    this.alertService.success('Mail Successfully Sent', true);
                    this.router.navigate(['/email']);
                  },
                  error => {
                      this.alertService.error(error.error.message);
                      this.loading = false;
                  }
                );
            },
            error => {
                this.loading = false;
            }
          );
    }
}
