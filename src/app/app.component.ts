import { Component } from '@angular/core';
import {LoginService} from "./modules/Services/Login-Services/login.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Clinic-Front';
  userType : string;
  constructor(private userService: LoginService, private router: Router) {
    // this.userType = userService.userType;
    // if(this.userType=='Doctor'){
    //   this.router.navigate(['Doctor-portal'])
    // }
    // if(this.userType=='Admin'){
    //   this.router.navigate(['Admin-portal'])
    // }
    // if(this.userType=='Reciptianist'){
    //   this.router.navigate(['Receptionist-portal'])
    // }
  }
}
