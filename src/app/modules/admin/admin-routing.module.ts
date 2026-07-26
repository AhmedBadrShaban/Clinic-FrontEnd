import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ReservationComponent } from '../receptionist/components/reservation/reservation.component';
import { RoomsComponent } from '../rooms/rooms.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { DoctorComponent } from './components/doctors/doctor/doctor.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { ReceptionistsComponent } from './components/receptionists/receptionists.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ServicesComponent } from './components/services/services.component';
import { PackagesComponent } from './components/packages/packages.component';
import { PackageComponent } from '../receptionist/components/package/package.component'; // ← NEW
import { ExpenseComponent } from '../receptionist/components/expense/expense.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ReceptionistProfileComponent } from './components/receptionists/receptionist/receptionist.component';
import { DoctorScheduleComponent } from '../receptionist/components/doctor-schedule/doctor-schedule.component';
import { ContributorsComponent } from "./components/contributors/contributors.component";
import { MonthlyMoneyReportComponent } from './components/reports/monthly-income/income.component';
import { CheckOutComponent } from '../rooms/check-out/check-out.component';
import { DebitReportComponent } from './components/reports/depit-report/debit-report.component';
import { DebitMovementsComponent } from './components/reports/debit-movements/debit-movements.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WhatsAppMessagesComponent } from './components/reports/whatsapp-messages/whatsapp-messages.component';
import { PackageMovementsComponent } from './components/reports/package-movements/package-movements.component';
import { PromotionRulesComponent } from './components/promotion-rules/promotion-rules.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'adminProfile', component: AdminProfileComponent },
      { path: 'rooms', component: RoomsComponent, pathMatch: 'full' },
      { path: 'rooms/check-out/:id', component: CheckOutComponent, pathMatch: 'full' },
      { path: 'expense', component: ExpenseComponent, pathMatch: 'full' },
      { path: 'patients', component: ReservationComponent },
      { path: 'patients/:phone', component: ReservationComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'doctor/:id', component: DoctorComponent },
      { path: 'receptionists', component: ReceptionistsComponent },
      { path: 'receptionist/:id', component: ReceptionistProfileComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'promotions', component: PromotionRulesComponent },
      { path: 'admin-package', component: PackagesComponent, pathMatch: 'full' },
      { path: 'reserved-packages', component: PackageComponent, pathMatch: 'full' }, // ← NEW
      { path: 'materials', component: MaterialsComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservation/:phone', component: ReservationComponent, pathMatch: 'full' },
      { path: 'doctor-schedular', component: DoctorScheduleComponent },
      { path: 'contributors', component: ContributorsComponent },
      {
        path: 'reports',
        children: [
          { path: 'debit-report', component: DebitReportComponent },
          { path: 'debit-movements', component: DebitMovementsComponent },
          { path: 'package-movements', component: PackageMovementsComponent },

          { path: 'monthly-income', component: MonthlyMoneyReportComponent },
          { path: 'whatsapp-messages', component: WhatsAppMessagesComponent },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }