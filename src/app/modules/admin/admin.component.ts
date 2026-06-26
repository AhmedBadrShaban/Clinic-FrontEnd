import { Router, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports: [AdminSidebarComponent, RouterOutlet]
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
]
constructor(private router: Router) {

}
GoTo(id: number){
  this.router.navigate(["admin" , this.pages[id]])
}

}
