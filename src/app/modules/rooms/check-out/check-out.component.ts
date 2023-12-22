import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from '../../Services/rooms/rooms.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  id: number;
  completedServices:any;

  constructor(private route: ActivatedRoute , private checkOutService:RoomsService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = +params['id'];
      console.log('ID:', this.id);
      this.checkOutService.checkOutReservation(this.id).subscribe((data)=>{
        this.completedServices = data;
        console.log('completedServices  : ',  this.completedServices );
      })

    });
  }

}
