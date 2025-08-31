import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceptionistRoutingModule } from './receptionist-routing.module';
import { ReceptionistComponent } from './receptionist.component';
import { NavBarComponent } from 'src/app/shared/components/nav-bar/nav-bar.component';
import { ReservationFmComponent } from './components/reservation-fm/reservation-fm.component';
import { CoverSheetComponent } from './components/cover-sheet/cover-sheet.component';
import { AddNewPatientComponent } from './components/add-new-patient/add-new-patient.component';
import { DoctorScheduleComponent } from './components/doctor-schedule/doctor-schedule.component';
import { PopUpFormComponent } from './components/doctor-schedule/pop-up-form/pop-up-form.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { AddExpenseComponent } from './components/expense/add-expense/add-expense.component';
import { PackageComponent } from './components/package/package.component';
import { AddPackageComponent } from './components/package/add-package/add-package.component';
import { DailySheetComponent } from './components/daily-sheet/daily-sheet.component';
import { PatientInfoComponent } from './components/reservation/patient-info/patient-info.component';
import { HistoryComponent } from './components/reservation/history/history.component';
import { PointsComponent } from './components/reservation/points/points.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ReservationsComponent } from './components/reservation/reservations/reservations.component';
import { PackagesComponent } from './components/reservation/packages/packages.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IdlePatientsComponent } from './components/reservation/idle-patients copy/idle-patients.component';
import { AddExpenseTypeComponent } from './components/expense/add-expense-type/add-expense-type.component';
import { PaymentHistoryComponent } from './components/reservation/payment-history/payment-history.component';
import { AddProductComponent } from './components/package/add-product/add-product.component';
import { SendPointsComponent } from './components/reservation/points/send-points/send-points.component';
import { RoomsComponent } from '../rooms/rooms.component';
import { AfterWorkComponent } from './components/reservation/after-work/after-work.component';
import { PackageDetailsComponent } from './components/reservation/packages/package-details/package-details.component';
import { UpdatePackageComponent } from './components/reservation/packages/package-details/update-package/update-package.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from './shared/table/table.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    ReceptionistComponent,
    ExpenseComponent,
    TableComponent,
    AddNewPatientComponent,
    DoctorScheduleComponent,
    PopUpFormComponent,
    AddExpenseComponent,
    PackageComponent,
    AddPackageComponent,
    DailySheetComponent,
    ReservationComponent,
    HistoryComponent,
    PointsComponent,
    IdlePatientsComponent,
    ReservationsComponent,
    PackagesComponent,
    PatientInfoComponent,
    ReservationFmComponent,
    CoverSheetComponent,
    AddExpenseTypeComponent,
    PaymentHistoryComponent,
    AddProductComponent,
    SendPointsComponent,
    AfterWorkComponent,
    PackageDetailsComponent,
    UpdatePackageComponent,
  ],
  imports: [
    CommonModule,
    ReceptionistRoutingModule,
    NavBarComponent,
    NzTableModule,
    NzDividerModule,
    NzLayoutModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzAutocompleteModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSnackBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NzTabsModule,
    NzPaginationModule,
    NzSelectModule,
    MatButtonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    NavBarComponent
  ],
  exports: [
    // Components
    NavBarComponent,
    PatientInfoComponent,
    HistoryComponent,
    AfterWorkComponent,
    PackagesComponent,
    PointsComponent,
    ReservationsComponent,
    ReservationComponent,
    AddNewPatientComponent,

    // Export Angular Material modules so they're available to importing modules
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,

    // Export Forms modules
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReceptionistModule { }