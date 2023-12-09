import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userName : string;
  userType : string;
  userToken : string;
  constructor() {
    this.userName = 'ahmed';
    this.userType = 'Reciptianist';
    this.userToken = '21sdf2sdf1sd2f0sd2fFad2s2f1sd2XXDad5as2d1a2D21a2dasd2ad1asd41ad5a4d'
  }

  login(userName : string , password: string){}
  logout(){}
}
