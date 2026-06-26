import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-doctor-nav-bar',
    templateUrl: './doctor-nav-bar.component.html',
    styleUrls: ['./doctor-nav-bar.component.css'],
    standalone: true,
    imports: [RouterLinkActive, RouterLink]
})
export class DoctorNavBarComponent {
  constructor(private logOut : AuthService , private router:Router){
  }
  loggOut(){
    this.logOut.logout();
   }


}
