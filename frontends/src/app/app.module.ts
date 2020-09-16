import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UiModule } from './ui/ui.module';
import { ReactiveFormsModule, FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailComponent } from './email/email.component';
import { ItemsComponent } from './items/items.component';
import { MailService } from './services/mail.service';
import { UserService } from './services/user.service';
import { OutboxComponent } from './outbox/outbox.component';
import { LoginComponent } from './login/login.component';
import { SocketioService } from './services/socketio.service';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ComposeComponent } from './compose/compose.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertComponent } from './directives/alert.component';
import { AlertService } from './services/alert.service';
import { ReplyComponent } from './reply/reply.component';
import { ForwardComponent } from './forward/forward.component';
import { OutboxItemsComponent } from './outbox-items/outbox-items.component';
@NgModule({
  declarations: [
    AppComponent,
    EmailComponent,
    ItemsComponent,
    OutboxComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ComposeComponent,
    AlertComponent,
    ReplyComponent,
    ForwardComponent,
    OutboxItemsComponent
  ],
  imports: [
    NgSelectModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    UiModule
  ],
  providers: [MailService, UserService, AlertService, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
