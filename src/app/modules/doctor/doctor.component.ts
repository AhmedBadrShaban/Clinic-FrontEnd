import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorNavBarComponent } from './components/doctor-nav-bar/doctor-nav-bar.component';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.css'],
    standalone: true,
    imports: [DoctorNavBarComponent, RouterOutlet]
})
export class DoctorComponent {

}
