import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
  //        index matches GoTo(n) calls in the template exactly
  pages = [
    'rooms',             // 0
    'patients',          // 1
    'doctors',           // 2
    'doctor-schedular',  // 3 
    'receptionists',     // 4
    'services',          // 5
    'admin-package',     // 6
    'reserved-packages', // 7   
    'materials',         // 8   
    'expense',           // 9  
    'monthly-income',     // 10
    'contributors',      // 11   
  
  ];

  constructor(private router: Router) { }

  GoTo(id: number): void {
    this.router.navigate(['admin', this.pages[id]]);
  }
}