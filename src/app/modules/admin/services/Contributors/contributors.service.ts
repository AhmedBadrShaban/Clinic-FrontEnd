import { Injectable } from '@angular/core';
import {Contributor} from "../../models/contributor";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContributorsService {
  private baseUrl:string="http://localhost:8080/";
  private token: string | null = sessionStorage.getItem('token');
  constructor(private http:HttpClient) { }
  addContributer(data:any){
    return this.http.post(`${this.baseUrl}api/auth/signup/contributor` , data);
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
