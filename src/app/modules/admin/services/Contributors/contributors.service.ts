import { Injectable } from '@angular/core';
import {Contributor} from "../../models/contributor";
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ContributorsService {
    private readonly baseUrl ;
  private token: string | null = sessionStorage.getItem('token');
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

    }

  addContributer(data:any){
    return this.http.post(`${this.baseUrl}api/v1/auth/signup/contributor` , data);
}
  // getData(): Contributor[]{
  //   return [
  //     {id: '5' , name: 'Ahmed'},
  //     {id: '5' , name: 'Ahmed'},
  //     {id: '5' , name: 'Ahmed'},
  //     {id: '5' , name: 'Ahmed'},
  //     {id: '5' , name: 'Ahmed'},
  //   ]
  // }

}
