import { Inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable({
  providedIn :'root'
})
export class AuthService{
  isLogged: boolean = localStorage.getItem('isLogged') === 'true';
  userType: string | null = localStorage.getItem('userType');
  constructor(private userService: UserService) {}
  login(username:string , password:string ){
    let user = this.userService.testUsers.find((u)=>u.username === username && u.password === password);

    if(user === undefined)
      this.isLogged=false;
    else{
     this.isLogged=true;
     this.userType=user.role;

     localStorage.setItem('isLogged', 'true');
     localStorage.setItem('userType', this.userType);
    }

     return user;
  }

  logout(){
    this.isLogged =false;
    this.userType=null;

    localStorage.removeItem('isLogged');
    localStorage.removeItem('userType');
  }
  isAauthenticated(){
    return this.isLogged;
  }

}
