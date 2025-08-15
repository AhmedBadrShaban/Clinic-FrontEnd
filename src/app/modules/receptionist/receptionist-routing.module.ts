import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionistComponent } from './receptionist.component';
import { RoomsComponent } from '../rooms/rooms.component';
import { AddNewPatientComponent } from './components/add-new-patient/add-new-patient.component';
import { CoverSheetComponent } from './components/cover-sheet/cover-sheet.component';
import { DailySheetComponent } from './components/daily-sheet/daily-sheet.component';
import { DoctorScheduleComponent } from './components/doctor-schedule/doctor-schedule.component';
import { PopUpFormComponent } from './components/doctor-schedule/pop-up-form/pop-up-form.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { PackageComponent } from './components/package/package.component';
import { ReservationFmComponent } from './components/reservation-fm/reservation-fm.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { CheckOutComponent } from '../rooms/check-out/check-out.component';

const routes: Routes = [
  { path: '', component: ReceptionistComponent ,children:[
    {path:"expense", component:ExpenseComponent ,  pathMatch:'full'},
    {path:"package", component:PackageComponent , pathMatch:'full'},
    {path:"addpatient", component:AddNewPatientComponent},
    {path:"doctorscedule",component:DoctorScheduleComponent},
    {path:"doctorscedule/new",component:PopUpFormComponent},
    {path:"dailysheet",component:DailySheetComponent},
    {path:"coversheet",component:CoverSheetComponent},
    { path: "reservation", component: ReservationComponent },
    { path: "reservation/:phone", component: ReservationComponent }  ,
    {path:"reservationform",component:ReservationFmComponent},
    {path: 'rooms', component: RoomsComponent, pathMatch:'full'},
    {path: 'rooms/check-out/:id', component: CheckOutComponent},

  ] },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionistRoutingModule { }
