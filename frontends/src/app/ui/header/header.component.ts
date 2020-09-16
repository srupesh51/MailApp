import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  accounts;
  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
  }
  getAccount(user) {
    console.log(user);
    localStorage.setItem('currentUser', user);
    this.router.navigate(['/']);
  }
  canAccess() {
    if(Object.keys(localStorage).length > 0) {
      this.accounts = Object.keys(localStorage);
      this.accounts = this.accounts.filter((account) => {
        return account !== 'currentUser';
      });
      return true;
    }
    return false;
  }
  logout(user) {
    localStorage.removeItem(user);
    localStorage.removeItem('currentUser');
    //this.authenticationService.logout();
    console.log(Object.keys(localStorage));
    if(Object.keys(localStorage).length === 0) {
        this.router.navigate(['/login']);
    } else {
      this.accounts = Object.keys(localStorage);
      console.log(this.accounts);
      const userEmail = this.accounts[0];
      localStorage.setItem('currentUser', userEmail);
      this.router.navigate(['/']);
    }
  }
}
