import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from "./user.service";

@Injectable({
  providedIn :'root'
})
export class AuthService{
  private baseUrl:string="http://192.168.1.6:8080/";
  isLogged: boolean = sessionStorage.getItem('isLogged') === 'true';

  private tokenKey = 'token';
  userType: string | null = sessionStorage.getItem('userType');
  constructor(private userService: UserService , private http: HttpClient) {}


  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/auth/signin`, credentials);
  }
  logout(){
    this.isLogged =false;
    this.userType=null;
    this.clearToken();
    sessionStorage.removeItem('isLogged');
    sessionStorage.removeItem('userType');
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  isAauthenticated(){
    return this.isLogged;
  }
  //if(user === undefined)
  //   this.isLogged=false;
  // else{
  //  this.isLogged=true;
  //  this.userType=user.role;

  //  sessionStorage.setItem('isLogged', 'true');
  //  sessionStorage.setItem('userType', this.userType);
  // }

  //  return user;

}
