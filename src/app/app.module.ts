import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzFormModule } from 'ng-zorro-antd/form';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from "@angular/material/button";
import{MatDialogModule, MatDialogRef} from "@angular/material/dialog"

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from "./shared/shared.module";
import {NavBarComponent} from "./shared/components/nav-bar/nav-bar.component";
 import { EventsGridComponent } from './modules/rooms/events-grid/events-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DatePickerComponent} from "./shared/components/date-picker/date-picker.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import { DialogEventComponent } from './modules/rooms/events-grid/dialog-event/dialog-event.component';

 import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {AutoCompleteComponent} from "./shared/components/auto-complete/auto-complete.component";
 import {RoomsComponent} from "./modules/rooms/rooms.component";
import {LoginComponent} from "./modules/login/login.component";
 import {Route, RouterLink, RouterModule, Routes} from '@angular/router';
  import { DatePipe } from '@angular/common';
import { AddNewRoomComponent } from './modules/rooms/add-new-room/add-new-room.component';
 import { AddClinicComponent } from './modules/rooms/add-clinic/add-clinic.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthService } from './shared/services/auth.service';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { CheckOutComponent } from './modules/rooms/check-out/check-out.component';
import { PaymentComponent } from './modules/rooms/check-out/payment/payment.component';
import {ReportsComponent} from "./shared/components/reports/reports.component";
import { UpdateReservationComponent } from './modules/rooms/events-grid/update-reservation/update-reservation.component';
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmPaymentDialogComponent } from './modules/rooms/check-out/confirm-payment-dialog/confirm-payment-dialog.component';
import { FinalCheckoutSummaryDialogComponent } from './modules/rooms/check-out/final-checkout-summary-dialog/final-checkout-summary-dialog.component';
import { ReservationCardComponent } from './modules/rooms/events-grid/reservation-card/reservation-card.component';
import { RoomsHeaderComponent } from './modules/rooms/rooms-header/rooms-header.component';
import { RoomTabsComponent } from './modules/rooms/rooms-tabs/rooms-tabs.component';
import { SlotPickerComponent } from './modules/rooms/slot-picker/slot-picker.component';

 
@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    EventsGridComponent,
    LoginComponent,
    AddNewRoomComponent,
     AddClinicComponent,
    NotFoundComponent,
    ForbiddenComponent,
    CheckOutComponent,
    PaymentComponent,
    ConfirmPaymentDialogComponent,
    FinalCheckoutSummaryDialogComponent,
    UpdateReservationComponent,
    ReservationCardComponent,
    RoomsHeaderComponent,
    RoomTabsComponent,
    SlotPickerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NzTableModule, NzDividerModule, NzLayoutModule, NzButtonModule, NzDatePickerModule, NzFormModule, NzAutocompleteModule,
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule, MatNativeDateModule, MatAutocompleteModule, MatCheckboxModule,MatChipsModule ,  MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatDialogModule, MatIconModule ,
    SharedModule,
    NavBarComponent,
    BrowserAnimationsModule,
    DatePickerComponent,
    NzTabsModule,
    DialogEventComponent,
    NzPaginationModule,
    NzSelectModule,
    AutoCompleteComponent,
    RouterLink,
    ReportsComponent,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
     MatButtonToggleModule,   
    MatTooltipModule,        
    MatRippleModule,        
  ],
  exports:[
    // ExpenseComponent,

  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    DatePipe ,   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
