import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservationFmComponent } from 'src/app/reciptianist/components/reservation-fm/reservation-fm.component';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {

  constructor(private dialogRef : MatDialog) {
       
  }
  openDialog(){

    this.dialogRef.open(ReservationFmComponent);


  }
  goToForm(){}
}
