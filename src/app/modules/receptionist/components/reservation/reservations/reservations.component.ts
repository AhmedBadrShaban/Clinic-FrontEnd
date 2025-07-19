// reservations.component.ts
import { Component, Input, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy {
  phoneNumber: any;
  @ViewChild('servicesTemplate', { static: true }) servicesTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<any>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0; // Changed to 0-based indexing to match Material table
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(private reservationsService: ReservationsService) { }

  ngOnInit(): void {
     console.log('in reservations tab   ')
     this.tableColumns = [
      { key: 'doctorName', label: 'Doctor' },
      { key: 'service', label: 'Services', template: this.servicesTemplate },
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'note', label: 'Note' },
      { key: 'status', label: 'Status', template: this.statusTemplate }
    ];

     this.sub.add(
      this.reservationsService.phone$.subscribe((data: any) => {
          this.phoneNumber = data;
          console.log('current Patient phone', this.phoneNumber)
          if(this.phoneNumber){
          this.getReservations(this.currentPage);
          }
      })
    );
  }

  getReservations(page: number): void {
    if (this.phoneNumber) {
       this.reservationsService.getReservationsHistory(this.phoneNumber, page, this.pageSize)
        .subscribe((data) => {
          console.log('data', data)
          this.dataSource.data = [...data.data];
          console.log('reservations received', this.dataSource.data);
          this.totalItems = data.totalItems;
        });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getReservations(this.currentPage);
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'IN_PROGRESS': 'btn-primary',
      'CONFIRMED': 'btn-success',
      'COMPLETED': 'btn-dark',
      'WAITING': 'btn-warning',
      'CANCELLED': 'btn-danger',
      'TO_DOCTOR': 'btn-info',
      'DONE': 'btn-secondary'
    };
    return statusClasses[status] || 'btn-secondary';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}