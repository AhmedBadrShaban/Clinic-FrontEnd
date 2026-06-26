import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservationFmComponent } from 'src/app/modules/receptionist/components/reservation-fm/reservation-fm.component';
import { ReservationsComponent as ReservationsComponent_1 } from '../../../receptionist/components/reservation/reservations/reservations.component';

@Component({
    selector: 'app-reservation',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.css'],
    standalone: true,
    imports: [ReservationsComponent_1]
})
export class ReservationsComponent {

  constructor(private dialogRef : MatDialog) {

  }
  openDialog(){

    this.dialogRef.open(ReservationFmComponent);


  }
  goToForm(){}
}
