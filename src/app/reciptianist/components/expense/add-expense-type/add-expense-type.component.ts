import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/reciptianist/services/expenses-service/expense.service';

@Component({
  selector: 'app-add-expense-type',
  templateUrl: './add-expense-type.component.html',
  styleUrls: ['./add-expense-type.component.css']
})
export class AddExpenseTypeComponent implements OnInit {

  expensetypeFm: FormGroup;
  constructor(private fb: FormBuilder ,public dialogRef: MatDialogRef<AddExpenseTypeComponent> , private expenseService:ExpenseService){
    this.expensetypeFm = fb.group({
      typeName: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {

  }
  submit() {
    let userModel=this.expensetypeFm.value;
    console.log( "form data before sending request",userModel);
    this.expenseService.addNewExpenseType(userModel).subscribe({
      next:(data)=>{
        console.log('new expense Type added :>> ',data);
        this.closeDialog();
       },
      error:(err)=>{
        console.log("error in editing: ", err);
      }
    })
    this.closeDialog();

  }
  closeDialog() {
    this.dialogRef.close();
  }

}
