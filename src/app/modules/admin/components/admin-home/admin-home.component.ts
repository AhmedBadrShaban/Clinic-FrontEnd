import { Component } from '@angular/core';
import {Router} from "@angular/router";

 @Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
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
        'contributors',
        'doctor-schedular',
    ]


    constructor(private router: Router ,) {

    }
  GoTo(id: number){
    this.router.navigate([ 'admin', this.pages[id]])
  }
}
