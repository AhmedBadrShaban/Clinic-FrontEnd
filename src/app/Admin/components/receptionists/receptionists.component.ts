import { Component, OnInit } from '@angular/core';
import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
} from 'ng-zorro-antd/table';
import { Doctors } from '../../models/doctors';
import { Receptionist } from '../../models/receptionist';
import { ReceptionistsService } from '../../services/receptionists/receptionists.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewReceptionistComponent } from './add-new-receptionist/add-new-receptionist.component';

@Component({
  selector: 'app-receptionists',
  templateUrl: './receptionists.component.html',
  styleUrls: ['./receptionists.component.css'],
})
export class ReceptionistsComponent implements OnInit {
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  receptionists: Receptionist[] = [];
  AllDataToSearchIn: any[];
  filteredData: any[] = [];
  searchValue?: any;

  constructor(
    private recService: ReceptionistsService,
    private router: Router,
    private dialogRef: MatDialog
  ) {
    (this.size = 'small' as NzTableSize),
      (this.paginationType = 'default' as NzTablePaginationType),
      (this.tableLayout = 'auto' as NzTableLayout),
      (this.position = 'bottom' as NzTablePaginationPosition);
    // this.receptionist = recService.getAllReceptionist()
  }
  ngOnInit(): void {
    this.getAllReciptianists();
    this.recService.listOfData$.subscribe((data: any) => {
      this.receptionists = data;
      console.log('Updated Data recived : ', this.receptionists);
      this.autoComplete();
    });
  }
  getAllReciptianists() {
    this.recService.getAllReciptianist().subscribe((data) => {
      this.receptionists = data;
      this.autoComplete();
      console.log('Reciptianists :>> ', this.receptionists);
    });
  }
  switchStatus(id: any) {
    this.recService.changeStatus(id).subscribe({
      next: (responed) => {
        alert(responed.message);
        this.getAllReciptianists();
      },
      error: (err) => {
        console.log('err :>> ', err.error.message);
      },
    });
  }

  search() {
    this.recService.search(this.searchValue).subscribe((data: any) => {
       this.receptionists=data;
      console.log('search recived dtaa : ', data);
    });
  }

  clearSearch() {
    this.getAllReciptianists();
    this.searchValue = null;
  }

  autoComplete() {
    this.AllDataToSearchIn = this.receptionists.map(
      (receptionists) => `${receptionists.name}`
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

  goToForm() {}
  openDialog() {
    this.dialogRef.open(AddNewReceptionistComponent);
  }
  goToReceptionistData(id: string , data:any) {
     this.router.navigate(['Areceptionist', id] , { queryParams: data });
  }
}
