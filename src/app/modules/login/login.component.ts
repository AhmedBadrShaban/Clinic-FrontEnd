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
      const credentials = {
        username: this.username.nativeElement.value,
        password: this.password.nativeElement.value
      }
      this.authService.login(credentials).subscribe(
        (data: any) => {
          // Handle successful login response
          console.log('Login successful', data);
          this.authService.isLogged=true;
          this.authService.userType=data.authority;
          this.authService.setToken( data.token);
          sessionStorage.setItem('isLogged', 'true');
          sessionStorage.setItem('userType',  data.authority);

          const userAuthority = data.authority;
          if(userAuthority==='ROLE_RECEPTIONIST'){
            this.router.navigateByUrl('receptionist')
          }
          else if(userAuthority==='ROLE_ADMIN'){
            this.router.navigateByUrl('admin')
          }
          else if( userAuthority==='ROLE_DOCTOR'){
            this.router.navigateByUrl('doctor')
          }
          else if(userAuthority==='ROLE_CONTRIBUTOR'){
            console.log('navigating Contributer :>> ');
            this.router.navigateByUrl('contributer')
          }
        },
        error => {
          // Handle login error
          alert(error.error.message);
        })
        // alert("welcome " + user.name );
      }

      test(c:number){
          this.authService.isLogged=true;
           sessionStorage.setItem('isLogged', 'true');
           if(c==2){
            this.authService.userType= 'ROLE_RECEPTIONIST';
            sessionStorage.setItem('userType',  this.authService.userType);
            this.router.navigateByUrl('receptionist')
          }
          else if(c==1){
            this.authService.userType= 'ROLE_ADMIN';
            sessionStorage.setItem('userType',  this.authService.userType);
            this.router.navigateByUrl('admin')
          }
          else if( c==3){
            this.authService.userType= 'ROLE_DOCTOR';
            sessionStorage.setItem('userType',  this.authService.userType);
             this.router.navigateByUrl('doctor')
          }
          else if( c==4){
            this.authService.userType= 'ROLE_CONTRIBUTER';
            sessionStorage.setItem('userType',  this.authService.userType);
             this.router.navigateByUrl('contributer')
          }
      }



    }
