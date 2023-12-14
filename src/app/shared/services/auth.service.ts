import { Inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable({
  providedIn :'root'
})
export class AuthService{
  isLogged : boolean =false;
  constructor(private userService: UserService) {}
  login(username:string , password:string ){
    let user = this.userService.testUsers.find((u)=>u.username === username && u.password === password);

    if(user === undefined)
      this.isLogged=false;
    else
     this.isLogged=true;

     return user;
  }

  logout(){
    this.isLogged =false;
  }
  isAauthenticated(){
    return this.isLogged;
  }




}
