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

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false; // NEW: to control lazy loading
  @ViewChild('servicesTemplate', { static: true }) servicesTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  private initialized = false; // NEW: track first load

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<any>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;

  constructor(private reservationsService: ReservationsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'doctorName', label: 'Doctor' },
      { key: 'service', label: 'Services', template: this.servicesTemplate },
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'note', label: 'Note' },
      { key: 'status', label: 'Status', template: this.statusTemplate }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Tab just became active for the first time
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.getReservations(this.currentPage);
    }

    // Phone number changed while tab is already active
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
          this.cd.detectChanges();
          this.loadingState = false;
        },
        error: () => {
          this.loadingState = false;
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
