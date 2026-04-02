import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from "./user.service";
import { ConfigService } from './config.service';

@Injectable({
  providedIn :'root'
})
export class AuthService{
    private readonly baseUrl ;
  isLogged: boolean = sessionStorage.getItem('isLogged') === 'true';

  private tokenKey = 'token';
  userType: string | null = sessionStorage.getItem('userType');
  isSuper: boolean | null = (() => {
    const stored = sessionStorage.getItem('isSuper');
    return stored !== null ? stored === 'true' : null;
  })();  constructor(private userService: UserService, private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }


  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/auth/signin`, credentials);
  }
  logout(){
    this.isLogged =false;
    this.userType=null;
    this.isSuper = null;

    this.clearToken();
    sessionStorage.removeItem('isLogged');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('isSuper');

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
