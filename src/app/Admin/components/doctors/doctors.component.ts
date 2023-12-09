import { Component, OnInit } from '@angular/core';
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
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
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  doctors: Doctors[] = [];
  AllDataToSearchIn: any[];
  filteredData: any[] = [];
  searchValue?: any;

  constructor(private docService : DoctorsService, private router: Router
    ,private dialogRef : MatDialog) {
        this.size= 'small' as NzTableSize,
        this.paginationType= 'default' as NzTablePaginationType,
        this.tableLayout='auto' as NzTableLayout,
        this.position= 'bottom' as NzTablePaginationPosition
        // this.doctors = docService.getDoctors()
  }
  ngOnInit(): void {
    this.getAllDoctors();
    this.docService.listOfData$.subscribe((data: any) => {
      this.doctors = data;
      console.log('Updated Data recived : ', this.doctors);
      this.autoComplete();
    });
  }
  getAllDoctors() {
    this.docService.getAllDoctors().subscribe((data) => {
      this.doctors = data;
      this.autoComplete();
      console.log('Doctors :>> ', this.doctors);
    });
  }
  switchStatus(id: any) {
    this.docService.changeStatus(id).subscribe({
      next: (responed) => {
        alert(responed.message);
        this.getAllDoctors();
      },
      error: (err) => {
        console.log('err :>> ', err.error.message);
      },
    });
  }

  search() {
    this.docService.search(this.searchValue).subscribe((data: any) => {
       this.doctors=data;
      console.log('search recived dtaa : ', data);
    });
  }

  clearSearch() {
    this.getAllDoctors();
    this.searchValue = null;
  }

  autoComplete() {
    this.AllDataToSearchIn = this.doctors.map(
      (doctors) => `${doctors.doctorName}`
    );
    this.filteredData = this.AllDataToSearchIn;
    console.log(this.filteredData);
  }

  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(
      (AllDataToSearchIn) =>
        AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  goToForm(){

  }
  openDialog(){
    this.dialogRef.open(AddNewDoctorComponent);
  }
  goToDoctorData(id : string ,data:any){
    this.router.navigate(['doctor' , id] , {queryParams:data})
  }
}
