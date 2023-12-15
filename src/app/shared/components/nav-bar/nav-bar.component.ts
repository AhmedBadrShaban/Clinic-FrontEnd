import {Component, NgModule} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone:true,
  imports: [RouterLink, RouterLinkActive,  ]
})
export class NavBarComponent {
  constructor(private logOut : AuthService , private router:Router){
  }
  loggOut(){
    this.logOut.logout();
   }


}
