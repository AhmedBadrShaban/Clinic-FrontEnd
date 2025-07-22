import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService  , private loggedIn:AuthService) { 
    this.baseUrl = this.configService.getBaseUrl();

  }
  getAllExpensesTypes():Observable<any>{
    if(this.loggedIn.userType=='ROLE_ADMIN'){
       return this.http.get<any>(`${this.baseUrl}admin/get-expenses-type`)
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/get-normal-expenses-type`)
  }
  getAllExpenses(page:number=0, pageSize: number=20):Observable<any>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    if(this.loggedIn.userType=='ROLE_ADMIN'){
    return this.http.get<any>(`${this.baseUrl}admin/expenses` , {params});
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/receptionist-expenses-v2`, { params });

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
    if(this.loggedIn.userType=='ROLE_ADMIN'){
    return this.http.get<any>(`${this.baseUrl}admin/filter-add-reciptionist-expenses-by-date?date=${date}`);
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/filter-expenses-v2?date=${date}`);
  }

private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
listOfData$ = this.listOfDataSubject.asObservable();

updateListOfData(data: readonly any[]) {
  this.listOfDataSubject.next(data);
}
}
