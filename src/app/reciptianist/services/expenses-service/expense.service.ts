import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private baseUrl:string="http://localhost:8080/receptionist/";
  constructor(private http :HttpClient) { }
  getAllExpensesTypes():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}get-expences-type`)
  }
  getAllExpenses():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist-expenses`);
  }
  addNewExpense(data:any){
    return this.http.post(`${this.baseUrl}expenses` , data);
  }
  addNewExpenseType(data:any){
    return this.http.post(`${this.baseUrl}expenses/type` , data);
  }
  filterByDate(date:any): Observable<any> {
    const url = 'http://localhost:8080/receptionist/filter-expenses';
    console.log("filtling by date of :" ,date);

    let queryParams = new HttpParams().append("date",date);

    return this.http.get<any>(url,{params:queryParams});
  }


private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
listOfData$ = this.listOfDataSubject.asObservable();

updateListOfData(data: readonly any[]) {
  this.listOfDataSubject.next(data);
}
}
