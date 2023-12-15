import { Inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable({
  providedIn :'root'
})
export class AuthService{
  isLogged: boolean = sessionStorage.getItem('isLogged') === 'true';
  userType: string | null = sessionStorage.getItem('userType');
  constructor(private userService: UserService) {}
  login(username:string , password:string ){
    let user = this.userService.testUsers.find((u)=>u.username === username && u.password === password);

    if(user === undefined)
      this.isLogged=false;
    else{
     this.isLogged=true;
     this.userType=user.role;

     sessionStorage.setItem('isLogged', 'true');
     sessionStorage.setItem('userType', this.userType);
    }

     return user;
  }

  logout(){
    this.isLogged =false;
    this.userType=null;

    sessionStorage.removeItem('isLogged');
    sessionStorage.removeItem('userType');
  }
  isAauthenticated(){
    return this.isLogged;
  }

}
