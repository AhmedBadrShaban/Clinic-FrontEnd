import { Component, OnInit } from '@angular/core';
import { BasicReservationData } from '../Models/basic-reservation-data';
import { DoctorReservationsService } from '../Services/doctor-reservations.service';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    standalone: true,
    imports: [NgFor, MatIconModule, NgIf, DatePipe]
})
export class MainPageComponent implements OnInit {
  reservations: BasicReservationData[] = [];
  today = new Date();

  constructor(
    private reservationsServ: DoctorReservationsService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllReservations();
  }

  getAllReservations(): void {
    this.reservationsServ.getAllDoctorReservation().subscribe((data) => {
      this.reservations = data;
    });
  }

  openReservation(reservation: BasicReservationData): void {
    console.log('[MainPage] Navigating with reservation state:', reservation);
    this.router.navigate(['doctor', 'reservation'], {
      queryParams: { id: reservation.reservationId },
      state: { reservation }
    });
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) return '';
    const timeAsDate = new Date(`1970-01-01T${time}`);
    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }
}