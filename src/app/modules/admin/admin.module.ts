import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { RouterLink } from "@angular/router";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { DoctorComponent } from './components/doctors/doctor/doctor.component';
import { AddNewDoctorComponent } from './components/doctors/add-new-doctor/add-new-doctor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReceptionistsComponent } from './components/receptionists/receptionists.component';
import { ReceptionistProfileComponent } from './components/receptionists/receptionist/receptionist.component';
import { ServicesComponent } from './components/services/services.component';
import { PackagesComponent } from './components/packages/packages.component';
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { AddNewReceptionistComponent } from './components/receptionists/add-new-receptionist/add-new-receptionist.component';
import { AddNewPackageComponent } from './components/packages/add-new-package/add-new-package.component';
import { ConfirmDialogComponent } from './components/packages/confirm-dialog/confirm-dialog.component';
import { AddNewServiceComponent } from './components/services/add-new-service/add-new-service.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { AddNewMatrialComponent } from './components/materials/add-new-matrial/add-new-matrial.component';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ReceptionistModule } from '../receptionist/receptionist.module';
import { ContributorsComponent } from './components/contributors/contributors.component';
import { AddContributorComponent } from './components/contributors/add-contributor/add-contributor.component';
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { MonthlyMoneyReportComponent } from './components/reports/monthly-income/income.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { DebitReportComponent } from './components/reports/depit-report/debit-report.component';
import { DebitMovementsComponent } from './components/reports/debit-movements/debit-movements.component';
 import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WhatsAppMessagesComponent } from './components/reports/whatsapp-messages/whatsapp-messages.component';
import { PackageMovementsComponent } from './components/reports/package-movements/package-movements.component';
import { PriceEditDialogComponent } from './components/packages/price-edit-dialog/price-edit-dialog.component';
import { PromotionRulesComponent } from './components/promotion-rules/promotion-rules.component';
import { PromotionRuleFormComponent } from './components/promotion-rules/promotion-rule-form/promotion-rule-form.component';

@NgModule({
  declarations: [
    AdminComponent,
    DoctorsComponent,
    DoctorComponent,
    AddNewDoctorComponent,
    ReceptionistsComponent,
    ReceptionistProfileComponent,
    ServicesComponent,
    PackagesComponent,
    ConfirmDialogComponent,
    MonthlyMoneyReportComponent,
    AddNewReceptionistComponent,
    AddNewPackageComponent,
    PriceEditDialogComponent,
    AddNewServiceComponent,
    ReservationsComponent,
    AdminProfileComponent,
    MaterialsComponent,
    AddNewMatrialComponent,
    ContributorsComponent,
    AddContributorComponent,
    DebitReportComponent,
    DebitMovementsComponent,
    PackageMovementsComponent,
    WhatsAppMessagesComponent,
    DashboardComponent,
    PromotionRulesComponent ,
    PromotionRuleFormComponent
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminNavBarComponent,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NzTableModule,
    NzBadgeModule,
    NzDropDownModule,
    NzAutocompleteModule,
    ReceptionistModule,
    NzTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule ,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    AdminSidebarComponent,
   ]
})
export class AdminModule { }