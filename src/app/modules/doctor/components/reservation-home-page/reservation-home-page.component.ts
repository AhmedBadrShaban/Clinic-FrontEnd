import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-reservation-home-page',
  templateUrl: './reservation-home-page.component.html',
  styleUrls: ['./reservation-home-page.component.css']
})
export class ReservationHomePageComponent {
  id: string;
  constructor(private activeted: ActivatedRoute) {
    this.activeted.params.subscribe(data =>{
      this.id = data['id']
    })
  }
}
