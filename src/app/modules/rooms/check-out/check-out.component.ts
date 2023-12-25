import { CompletedService, PointsService } from './../../receptionist/models/payment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from '../../Services/rooms/rooms.service';
import { MatDialog } from '@angular/material/dialog';
 import { PaymentComponent } from './payment/payment.component';
import { PaymentService } from '../../receptionist/services/payment/payment.service';
import { NormalPayment, Payments } from '../../receptionist/models/payment';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  id: number;
  completedServices: CompletedService[]=[] ;
  selectedCardIndex: number=0 ;
  selectedMethod:number=0;
  paymentsMethods: Payments = {
    normal: [] , // Initialize 'normal' as an empty array
    points: [],
    pointsService: [],
    packages: []
  };
  normalPayment:NormalPayment = {
    serviceName: "",
    pulses: 0,
    cash: null,
    visa: null,
    vodafoneCash: null,
    debit: null,
    credit: null,
    instaPay: null,
    totalCost: null,
  }
  TotalPoints:number=0;
  usedPoints:number=0;
  showPointsButton:boolean = false;
  showRemainCash:boolean =false;

  constructor(private route: ActivatedRoute , private checkOutService:RoomsService , private payment:PaymentService  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = +params['id'];
      console.log('ID:', this.id);
      this.checkOutService.checkOutReservation(this.id).subscribe((data)=>{
        this.completedServices = data.map((service: CompletedService) => ({
          ...service,
          Paid: false // Default value for the 'Paid' property
        }));
        console.log('completedServices  : ', this.completedServices);
      });
    });

    this.payment.AvaillableMethods(this.id).subscribe((data)=>{
      if(data.normal){
        this.paymentsMethods.normal = data.normal;
      }
      this.paymentsMethods.packages = data.packages;
      this.paymentsMethods.points = data.points;
      if(this.paymentsMethods.points.length>0){
        this.TotalPoints = this.paymentsMethods.points[0];
      }
      console.log('Data :>> ',  this.paymentsMethods);
    })

  }


  CompletePayment()
  {
    const done = this.areAllServicesPaid();
    if(done){
      this.payment.completePayment(this.id ,this.paymentsMethods ).subscribe({
        next:(res:any)=>{
          alert(res.message)
        } , 
        error:(err)=>{
          alert(err.error.message);
        }
      })
    }
    else{
      alert('There Are Services Not Paid Yet')
    }
  }
  
  submitNormalPayment(s:CompletedService)
  {
    
    this.normalPayment.serviceName =s.serviceName;
    const overAllCost = s.totalCost;
    const overAllPulses = s.pulses;
    let paid =this.normalPayment.cash + this.normalPayment.vodafoneCash + this.normalPayment.visa + this.normalPayment.credit + this.normalPayment.instaPay + this.normalPayment.debit ;
    this.normalPayment.totalCost = paid;
    this.normalPayment.pulses = paid / s.price;
    if(!this.showRemainCash){
      this.usedPoints = 0;
    }
    else if( overAllCost > paid + this.usedPoints * s.price )
     {
      if(this.paymentsMethods.points[0] > s.totalCost - paid +  this.usedPoints * s.price )
      {
        
        this.showPointsButton =true;

        return
       }
      else{
        alert("Total Payments is Less Than Total Cost")
        return;
      }
     }
    else if (overAllCost < paid +  this.usedPoints * s.price)
     {
       alert("Total Payments Value is More Than the Total Cost !! ")
       return;
     }

    this.paymentsMethods.normal.push(this.normalPayment);
    this.updatePaidStatus(s.serviceName , true);
    this.reset();
    console.log( 'Now Current Payment' ,this.paymentsMethods)
    this.selectedCardIndex +=1;
    
  }
  payUsingRemainPoints(s:CompletedService){
    const paid =this.normalPayment.cash + this.normalPayment.vodafoneCash + this.normalPayment.visa + this.normalPayment.credit + this.normalPayment.instaPay + this.normalPayment.debit;
    console.log('paid :>> ', paid);
    if(!this.showRemainCash){
      this.usedPoints = 0;
    }
    const pointService:PointsService ={
      serviceName:s.serviceName,
      numberOfPulses: (s.totalCost -paid)/s.price - this.usedPoints
    };
    this.paymentsMethods.points[0] -=  pointService.numberOfPulses;
    console.log('pointService become :>> ', this.paymentsMethods.points[0]);
    this.paymentsMethods.normal.push(this.normalPayment);
    this.paymentsMethods.pointsService.push(pointService);
    this.updatePaidStatus(s.serviceName , true);
    console.log( 'Now Current Payment' ,this.paymentsMethods);
    this.reset();
    this.selectedCardIndex +=1;
  }
  PayUsingPoints(s:CompletedService){
     console.log('s.totalCost  :>> ', s.totalCost );
     if(this.usedPoints<0  || this.usedPoints > this.paymentsMethods.points[0]){
      alert("Not allowed Value")
      return;
     }
    else if(this.usedPoints > s.pulses){
      alert("Used Points is More Than Required Service Points !");
      return;
     }
     const pointService:PointsService ={
      serviceName:s.serviceName,
      numberOfPulses:this.usedPoints
    };
    this.paymentsMethods.points[0] -=  this.usedPoints;
     this.paymentsMethods.pointsService.push(pointService);
     if(s.pulses !== this.usedPoints){
      this.showRemainCash = true;
       return;
     }
    this.updatePaidStatus(s.serviceName , true);
    this.reset();
    console.log( 'Now Current Payment' ,this.paymentsMethods);
    this.selectedCardIndex +=1;
  }

  payFromPackages(index: number , s:CompletedService){
    this.selectedCardIndex = index;
    this.selectedMethod=3;

    //Decrease Number of Sessions
    for (const pack of this.paymentsMethods.packages) {
      if (
        pack.reservedServiceInPackage &&
        pack.reservedServiceInPackage.serviceName === s.serviceName
      ) {
           pack.reservedServiceInPackage.sessions -=1;
           break;
      }
    }

    //Update and Reset and Change Index 

    this.updatePaidStatus(s.serviceName , true);
    this.reset();
    console.log( 'Now Current Payment' ,this.paymentsMethods);
    this.selectedCardIndex +=1;
  }
 
  updatePaidStatus(serviceName: string, paid: boolean): void {
    const serviceIndex = this.completedServices.findIndex(service => service.serviceName === serviceName);
  
    if (serviceIndex !== -1) {
      this.completedServices[serviceIndex].Paid = paid;
      console.log(`Paid status updated for ${serviceName}: ${paid}`);
    } else {
      console.warn(`Service with serviceName ${serviceName} not found.`);
    }
  }
  reset(){
    this.normalPayment = {
      serviceName: "",
      pulses: 0,
      cash: null,
      vodafoneCash: null,
      visa: null,
      credit: null,
      instaPay: null,
      debit: null,
      totalCost: null,
    };
    this.showPointsButton = false;
    this.showRemainCash =false;
    this.TotalPoints = this.paymentsMethods.points[0];
    console.log(' TotalPoints  :>> ',   this.TotalPoints );
    this.usedPoints=0;
  }
  clear(){
    this.showPointsButton =false;
  }
  areAllServicesPaid(): boolean {
    return this.completedServices.every(service => service.Paid === true);
  }
  doesServiceExist(serviceNameToSearch: string): number {
    for (const pack of this.paymentsMethods.packages) {
      if (
        pack.reservedServiceInPackage &&
        pack.reservedServiceInPackage.serviceName === serviceNameToSearch
      ) {
         return pack.reservedServiceInPackage.sessions;
      }
    }
    return 0;
  }
  showNormal(index: number) {
    this.selectedCardIndex = index;
    this.selectedMethod=1;
  }
  showPoints(index: number){
    this.selectedCardIndex = index;
    this.selectedMethod=2;

  }
 
}
