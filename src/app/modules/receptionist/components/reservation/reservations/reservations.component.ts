import { reservation } from './../../../models/event-reservation.model';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { Subscription } from 'rxjs';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false;
  @ViewChild('servicesTemplate', { static: true }) servicesTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  private initialized = false;

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<any>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;
  cancellingId: number | null = null; // tracks which row is being cancelled

  constructor(private reservationsService: ReservationsService, private roomsService: RoomsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'doctorName', label: 'Doctor' },
      { key: 'service', label: 'Services', template: this.servicesTemplate },
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'clinic', label: 'Clinic' },
      { key: 'note', label: 'Note' },
      { key: 'status', label: 'Status', template: this.statusTemplate },
      { key: 'action', label: 'Action', template: this.actionTemplate }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.getReservations(this.currentPage);
    }
    if (changes['phoneNumber'] && this.isActive && this.phoneNumber) {
      this.getReservations(this.currentPage);
    }
  }

  getReservations(page: number): void {
    if (!this.phoneNumber) return;
    this.loadingState = true;

    this.reservationsService
      .getReservationsHistory(this.phoneNumber, page, this.pageSize)
      .subscribe({
        next: (data) => {
          this.dataSource.data = [...data.data];
          this.totalItems = data.totalItems;
          this.loadingState = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.loadingState = false;
        }
      });
  }

  cancelReservation(row: any): void {
    // alert('Cancellation  will be availlable soon. :-(');
     const confirmed = confirm('Are you sure you want to cancel this reservation?');
    if (!confirmed) return;

    // Step 2: get reason before calling API
    const reason = prompt('Please provide a cancellation reason:');
    if (!reason) return;

    this.cancellingId = row.id;
    this.cd.detectChanges();

    this.roomsService.changeReservationStatus(row.reservationId, 'CANCELED', reason)
      .subscribe({
        next: () => {
           row.status = 'CANCELLED';
          row.note = reason;
          this.cancellingId = null;
          this.cd.detectChanges();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to cancel reservation');
          this.cancellingId = null;
          this.cd.detectChanges();
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getReservations(this.currentPage);
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      IN_PROGRESS: 'btn-primary',
      CONFIRMED: 'btn-success',
      COMPLETED: 'btn-dark',
      WAITING: 'btn-warning',
      CANCELLED: 'btn-danger',
      TO_DOCTOR: 'btn-info',
      DONE: 'btn-secondary'
    };
    return statusClasses[status] || 'btn-secondary';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}