import { Component } from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";
import { Router, RouterLinkActive, RouterLink } from "@angular/router";

@Component({
    selector: 'app-nav-bar-cont',
    templateUrl: './nav-bar-cont.component.html',
    styleUrls: ['./nav-bar-cont.component.css'],
    standalone: true,
    imports: [RouterLinkActive, RouterLink]
})
export class NavBarContComponent {
  constructor(private logOut : AuthService , private router:Router){
  }
  loggOut(){
    this.logOut.logout();
  }
}
