import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('username') username :ElementRef
  @ViewChild('password') password :ElementRef
    constructor(private authService:AuthService , private router:Router){

    }
    ngOnInit(): void {
      console.log("loggedin user type"  ,this.authService.userType);
      if(this.authService.isLogged){
        this.router.navigate([this.authService.userType])
      }

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
        if(this.authService.userType==='receptionist'){
          this.router.navigateByUrl('receptionist')
        }
        else if(this.authService.userType==='admin'){
          this.router.navigateByUrl('admin')
        }
        else if(this.authService.userType==='doctor'){
          this.router.navigateByUrl('doctor')
        }
      }



    }
}
