import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';

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
   debit=false;
  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public reservation: any={}, private roomsService:RoomsService ,  private patienDepit:PatientService,public dialog: MatDialog ,
   private router : Router , private datePipe:DatePipe
  )
  {
    //console.log(' Recived data :>> ', reservation);
  }
  ngOnInit(): void {
    this.patienDepit.checkDepit(this.reservation.patientPhone).subscribe((data)=>{

      this.debit = data;
    })

  }
  chengeReservationStatus( id:number,status:string){
    this.roomsService.chengeReservationStatus(id , status).subscribe({
      next:(response:any)=>{
        alert(response.message);
        this.UpdateAllReservations();
        this.updateAvailableSlots();
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
  close(){
    this.dialogRef.close();
  }
  openDialog(){
    //console.log('currentActiveRoom :>> ', this.reservation.roomName);
    this.close();
    this.dialog.open(UpdateReservationComponent ,  {data:this.reservation} );
    }

  UpdateAllReservations(){
    this.roomsService.getAllReservations(this.reservation.reservationDate).subscribe((data:any)=>{
      this.roomsService.updateData(data);
      //console.log( "data Updated : " ,data);
    })
  }
  updateAvailableSlots(){
    this.roomsService.getAvalliableSlots( this.reservation.roomName ,this.reservation.reservationDate).subscribe((data=>{
      //console.log('updated :>> ', data);
      this.roomsService.updateSlots(data);
    }))


  }
  checkOut(id:number){
    //console.log('id before navigating :>> ', id);
    this.router.navigateByUrl(`receptionist/rooms/check-out/${id}`);
    this.close();
  }
  formatTimeTo12Hour(time: string): string {
    if (!time) {
     return '';
   }
   const timeAsDate = new Date(`1970-01-01T${time}`);

    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
 }
}
