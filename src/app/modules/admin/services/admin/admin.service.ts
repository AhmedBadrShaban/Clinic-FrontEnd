import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin,StatusOfAdmin } from '../../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // private baseUrl:string="http://localhost:3000/";
  // constructor(private http :HttpClient ,private configService:ConfigService ) { }
  
  // getAdmin(adminId: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}admins/${adminId}`);
  // }

  getAllAdmin() : Admin[]{
    return (
      [
        {
          id: '5',
          name: 'lolololo',
          nationalId: '3030303030',
          phoneNumber: "01010101010",
          address: 'el heicustip',
          email: 'anaMshHena@ii.eg',
          salary: 1500,
          status: StatusOfAdmin.ACTIVE
        },
        {
          id: '7',
          name: 'lolololo',
          nationalId: '3030303030',
          phoneNumber: "01010121010",
          address: 'el heicustip',
          email: 'anaMshHena@ii.eg',
          salary: 1500,
          status: StatusOfAdmin.SUSPENDED
        },
        {
          id: '10',
          name: 'lolololo',
          nationalId: '3030303030',
          phoneNumber: "01010101010",
          address: 'el heicustip',
          email: 'anaMshHena@ii.eg',
          salary: 1500,
          status: StatusOfAdmin.ACTIVE
        },
        {
          id: '16',
          name: 'lolololo',
          nationalId: '3030303030',
          phoneNumber: "01010121010",
          address: 'el heicustip',
          email: 'anaMshHena@ii.eg',
          salary: 1500,
          status: StatusOfAdmin.SUSPENDED
        }
      ]
    )
  }
  getAdminById(id:string) : Admin{
    return ({
      id: '5',
      name: 'Samir',
      nationalId: '3030303030',
      phoneNumber: "01010101010",
      address: 'el heicustip',
      email: 'samir@gmail.eg',
      salary: 2000,
      status: StatusOfAdmin.ACTIVE
    })
  }

}
