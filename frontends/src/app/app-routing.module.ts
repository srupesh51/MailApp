import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmailComponent} from './email/email.component';
import { ItemsComponent } from './items/items.component';
import { OutboxComponent } from './outbox/outbox.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ComposeComponent } from './compose/compose.component';
import { ReplyComponent } from './reply/reply.component';
import { ForwardComponent } from './forward/forward.component';
import { OutboxItemsComponent } from './outbox-items/outbox-items.component';
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'email', component: EmailComponent},
  {path: 'outbox', component: OutboxComponent},
  {path: 'mail/:id', component: ItemsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path:'compose', component: ComposeComponent},
  {path: 'reply/:id', component: ReplyComponent},
  {path: 'forward/:id', component: ForwardComponent},
  {path: 'sent/:id', component: OutboxItemsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
