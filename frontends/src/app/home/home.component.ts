import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    if(localStorage === null || localStorage === undefined) {
      this.router.navigate(['/login']);
    }
    if(Object.keys(localStorage) !== undefined && Object.keys(localStorage).length === 0) {
      this.router.navigate(['/login']);
    } else {
      if(localStorage.getItem('currentUser') !== undefined) {
        this.router.navigate(['email']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

}
