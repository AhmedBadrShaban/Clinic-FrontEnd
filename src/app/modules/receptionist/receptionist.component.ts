import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
    selector: 'app-receptionist',
    templateUrl: './receptionist.component.html',
    styleUrls: ['./receptionist.component.css'],
    standalone: true,
    imports: [NavBarComponent, RouterOutlet]
})
export class ReceptionistComponent {

}
