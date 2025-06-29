import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private baseUrl:string="http://192.168.1.6:8080/";
  constructor(private http :HttpClient , private loggedIn:AuthService) { }
  getAllExpensesTypes():Observable<any>{
    if(this.loggedIn.userType=='ROLE_ADMIN'){
       return this.http.get<any>(`${this.baseUrl}admin/get-expenses-type`)
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/get-normal-expenses-type`)
  }
  getAllExpenses():Observable<any>{
    if(this.loggedIn.userType=='ROLE_ADMIN'){
    return this.http.get<any>(`${this.baseUrl}admin/expenses`);
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/receptionist-expenses`);

  }
  addNewExpense(data:any){
    if(this.loggedIn.userType=='ROLE_ADMIN'){
    return this.http.post(`${this.baseUrl}admin/expenses` , data);
    }
    return this.http.post(`${this.baseUrl}receptionist/expenses` , data);

  }
  addNewExpenseType(data:any){
    return this.http.post(`${this.baseUrl}admin/add-expense-type` , data);
  }
  filterByDate(date:any): Observable<any> {
    //console.log("filtling by date of :" ,date);
    if(this.loggedIn.userType=='ROLE_ADMIN'){
    return this.http.get<any>(`${this.baseUrl}admin/filter-add-reciptionist-expenses-by-date?date=${date}`);
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/filter-expenses?date=${date}`);
  }


private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
listOfData$ = this.listOfDataSubject.asObservable();

updateListOfData(data: readonly any[]) {
  this.listOfDataSubject.next(data);
}
}
