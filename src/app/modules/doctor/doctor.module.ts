import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorComponent } from './doctor.component';
import { DoctorNavBarComponent } from './components/doctor-nav-bar/doctor-nav-bar.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ReceptionistModule } from '../receptionist/receptionist.module';

 import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
 
import { DoctorReservationComponent } from './components/reservation-home-page/reservation-home-page.component';
 
@NgModule({
  declarations: [
    DoctorComponent,
    DoctorNavBarComponent,
    DoctorProfileComponent,
    DoctorReservationComponent,
    MainPageComponent,
  ],
  exports: [
    DoctorNavBarComponent,
    MainPageComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReceptionistModule,
 
    // Angular Material Modules
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,

 
  ]
})
export class DoctorModule { }