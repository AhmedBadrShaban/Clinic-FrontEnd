import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {reservation} from "../../../../reciptianist/models/event-reservation.model";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, NgClass, NgForOf, NgIf, DatePipe],
  providers: [DatePipe]
})
export class DialogEventComponent implements OnInit {
  toggle = false;
  toggle2 = false;
  date = '2023-12-10'
  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: reservation, private roomsService:RoomsService
  ) {}
  ngOnInit(): void {

  }
  chengeReservationStatus( id:number,status:string){
    this.roomsService.chengeReservationStatus(id , status).subscribe({
      next:(response:any)=>{
        alert(response.message);
        this.UpdateAllReservations();
        this.close();

      },
      error:(err)=>{
        alert(err.error.message);
      }


    })
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  changeToogle(){
    this.toggle = !this.toggle;
  }
  changeToogle2(){
    this.toggle2 = !this.toggle2;

  }
  close(){
    this.dialogRef.close();
  }
  UpdateAllReservations(){
    this.roomsService.getAllReservations(this.data.reservationDate).subscribe((data:any)=>{
      this.roomsService.updateData(data);
      console.log( "data Updated : " ,data);
    })
  }
}
