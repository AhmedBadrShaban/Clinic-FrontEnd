import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'Clinic-Front';
  userType : string;
  constructor( ) {
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
