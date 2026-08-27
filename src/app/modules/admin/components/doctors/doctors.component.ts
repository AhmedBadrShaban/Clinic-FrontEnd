import { Component, OnInit } from '@angular/core';
import {Doctors} from "../../models/doctors";
import {DoctorsService} from "../../services/doctors/doctors.service";
import {Router} from "@angular/router";
import { AddNewDoctorComponent } from './add-new-doctor/add-new-doctor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: Doctors[] = [];
  doctorsTemp: Doctors[] = [];
  allDoctors: Doctors[] = [];
  AllDataToSearchIn: any[];
  filteredData: any[] = [];
  searchValue?: any;
  isLoading = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalItems = 0;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) arr.push(i);
    return arr;
  }

  get pagedDoctors(): Doctors[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.doctors.slice(start, start + this.pageSize);
  }

  constructor(private docService: DoctorsService, private router: Router, private dialogRef: MatDialog) {}

  ngOnInit(): void {
    this.getAllDoctorsReports();
    this.docService.listOfData$.subscribe((data: any) => {
      this.doctors = data || [];
      this.autoComplete();
    });
  }

  getAllDoctorsReports() {
    this.isLoading = true;
    this.docService.DoctorsReport().subscribe((data) => {
      this.isLoading = false;
      this.allDoctors = data || [];
      this.doctors = [...this.allDoctors];
      this.doctorsTemp = [...this.allDoctors];
      this.totalItems = this.doctors.length;
      this.pageIndex = 1;
      this.autoComplete();
    });
  }

  getAllDoctors() {
    this.docService.getAllDoctors().subscribe((data) => {
      this.doctors = data || [];
      this.totalItems = this.doctors.length;
      this.autoComplete();
    });
  }

  switchStatus(id: any) {
    this.docService.changeStatus(id).subscribe({
      next: (responed) => {
        alert(responed.message);
        this.getAllDoctorsReports();
      },
      error: (err) => {
        //console.log('err :>> ', err.error.message);
      },
    });
  }

  search() {
    const query = (this.searchValue || '').toString().trim().toLowerCase();
    if (!query) {
      this.clearSearch();
      return;
    }
    this.doctors = this.allDoctors.filter(doctor =>
      (doctor.doctorName || '').toLowerCase().includes(query)
    );
    this.totalItems = this.doctors.length;
    this.pageIndex = 1;
  }

  clearSearch() {
    this.getAllDoctorsReports();
    this.searchValue = null;
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageIndex = page;
  }

  autoComplete() {
    this.AllDataToSearchIn = this.allDoctors.map(doctors => `${doctors.doctorName}`);
    this.filteredData = this.AllDataToSearchIn;
  }

  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(
      (d) => d.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  openDialog() {
    this.dialogRef.open(AddNewDoctorComponent);
  }

  goToDoctorData(id: string) {
    this.router.navigate(['admin/doctor', id]);
  }
}
