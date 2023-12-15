import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent {
  constructor(private logOut : AuthService , private router:Router){
  }
  loggOut(){
    this.logOut.logout();
   }

}
