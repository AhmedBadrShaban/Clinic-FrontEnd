import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  pages = [
    'rooms',
    'patients',
    'doctors',
    'receptionists',
    'services',
    'admin-package',
    'materials',
    'reservations',
    'expense',
    'reports'
  ];

  constructor(private router: Router) { }
  onSidebarToggle(collapsed: boolean): void {
    // shell class binding handles layout automatically
  }
  GoTo(id: number) {
    this.router.navigate(['admin', this.pages[id]]);
  }
}