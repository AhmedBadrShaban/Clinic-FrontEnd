import { Component, ElementRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('username') username :ElementRef
  @ViewChild('password') password :ElementRef
    constructor(private authService:AuthService , private router:Router){

    }
    onLoginClicked(){
      const userName= this.username.nativeElement.value;
      const password= this.password.nativeElement.value;
      const user = this.authService.login(userName , password);

      if(user === undefined)
      {
        alert("Wrong Credintials")
      }
      else{
        alert("welcome" + user.name );
        this.router.navigateByUrl('')
      }



    }
}
