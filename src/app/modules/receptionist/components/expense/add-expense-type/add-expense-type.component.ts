import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/modules/receptionist/services/expenses-service/expense.service';

@Component({
  selector: 'app-add-expense-type',
  templateUrl: './add-expense-type.component.html',
  styleUrls: ['./add-expense-type.component.css']
})
export class AddExpenseTypeComponent implements OnInit {

  expensetypeFm: FormGroup;
  constructor(private fb: FormBuilder ,public dialogRef: MatDialogRef<AddExpenseTypeComponent> , private expenseService:ExpenseService){
    this.expensetypeFm = fb.group({
      type: ['', [Validators.required]],
      company:[false],
    });
  }
  ngOnInit(): void {

  }
  submit() {
    let userModel=this.expensetypeFm.value;
    //console.log( "form data before sending request",userModel);
    this.expenseService.addNewExpenseType(userModel).subscribe({
      next:(data:any)=>{
        alert(data.message);
        this.closeDialog();
       },
      error:(err)=>{
        alert(err.error.message);
      }
    })
    this.closeDialog();

  }
  closeDialog() {
    this.dialogRef.close();
  }

}
