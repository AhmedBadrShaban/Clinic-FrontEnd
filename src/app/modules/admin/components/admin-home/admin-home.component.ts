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
    'receptionists',     // 3
    'services',          // 4
    'admin-package',     // 5
    'reserved-packages', // 6  ← NEW — placed before materials
    'materials',         // 7  ← was 6, shifted by 1
    'reservations',      // 8
    'expense',           // 9  ← was 8
    'contributors',      // 9  ← was 9 (no change in template GoTo)
    'doctor-schedular',  // 10
    'monthly-income'     // 11
  ];

  constructor(private router: Router) { }

  GoTo(id: number): void {
    this.router.navigate(['admin', this.pages[id]]);
  }
}