import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ReceptionistHomeComponent} from "./receptionist-home/receptionist-home.component";
import { DoctorScheduleComponent } from './components/doctor-schedule/doctor-schedule.component';
import { AddNewPatientComponent } from './components/add-new-patient/add-new-patient.component';
import { PackageComponent } from './components/package/package.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ReservationFmComponent } from './components/reservation-fm/reservation-fm.component';
import { CoverSheetComponent } from './components/cover-sheet/cover-sheet.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { DailySheetComponent } from './components/daily-sheet/daily-sheet.component';
import {RoomsComponent} from "../modules/rooms/rooms.component";
import {AdminHomeComponent} from "../Admin/admin-home/admin-home.component";
import { PopUpFormComponent } from './components/doctor-schedule/pop-up-form/pop-up-form.component';

// import {RoomsComponent} from "../shared/components/rooms/rooms.component";

const routes: Routes = [
  {path:'', component: ReceptionistHomeComponent},
  {path:"expense", component:ExpenseComponent},
  {path:"package", component:PackageComponent},
  {path:"addpatient", component:AddNewPatientComponent},
  {path:"doctorscedule",component:DoctorScheduleComponent},
  {path:"doctorscedule/new",component:PopUpFormComponent},
  {path:"dailysheet",component:DailySheetComponent},
  {path:"coversheet",component:CoverSheetComponent},
  {path:"reservation",component:ReservationComponent},
  {path:"reservationform",component:ReservationFmComponent},
  {path: 'rooms', component: RoomsComponent},
  {path: 'AdminHome', component: AdminHomeComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ReceptionistRoutingModule {
}
