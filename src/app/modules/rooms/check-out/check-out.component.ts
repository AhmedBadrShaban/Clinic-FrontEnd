import { CompletedService, PointsService } from './../../receptionist/models/payment';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '../../Services/rooms/rooms.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaymentService } from '../../receptionist/services/payment/payment.service';
import { NormalPayment, Payments } from '../../receptionist/models/payment';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  id: number;
  patientName: string = '';
  patientPhone: string = '';
  completedServices: CompletedService[]=[] ;
  selectedCardIndex: number=0 ;
  selectedMethod:number=0;
  paymentsMethods: Payments = {
    normal: [] , // Initialize 'normal' as an empty array
    points: [],
    pointsService: [],
    packages: []
  };
  showReceipt:boolean=false;
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
  generatedAt: Date = new Date();
  displayedColumns: string[] = ['serviceName', 'pulses', 'price', 'totalCost', 'payments'];

  @ViewChild('checkoutReceiptSection', { static: false }) checkoutReceiptSection?: ElementRef;

  constructor(private route: ActivatedRoute ,private router:Router, private checkOutService:RoomsService , private payment:PaymentService  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.patientName = params['patientName'];
      this.patientPhone = params['patientPhone'];
      // console.log('Checkout params:', this.patientName, this.patientPhone);
    });
    this.route.params.subscribe(params => {
       this.id = +params['id'];
      //console.log('ID:', this.id);
      this.checkOutService.checkOutReservation(this.id).subscribe({
        next:(data)=>{
          this.completedServices = data.map((service: CompletedService) => ({
            ...service,
            Paid: false // Default value for the 'Paid' property
          }));
          //console.log('completedServices  : ', this.completedServices);
          this.availablePaymentsMethods();
        },
        error:(err)=>{
            alert(err.error.text)
            this.navigateToRooms();
            }
      })
    });


  }
  availablePaymentsMethods(){
    this.payment.AvaillableMethods(this.id).subscribe((data)=>{
      if(data.normal){
        this.paymentsMethods.normal = data.normal;
      }
      this.paymentsMethods.packages = data.packages;
      this.paymentsMethods.points = data.points;
      if(this.paymentsMethods.points.length>0){
        this.TotalPoints = this.paymentsMethods.points[0];
      }
      //console.log('Methods :>> ',  this.paymentsMethods);
    })
  }

  CompletePayment()
  {
    const done = this.areAllServicesPaid();
    if(done){
      // this.showReceipt =true;
      if(this.paymentsMethods.points.length===0){
        this.paymentsMethods.points.push(0);
      }
      this.payment.completePayment(this.id ,this.paymentsMethods ).subscribe({
        next:(res:any)=>{
          alert(res.message)
          this.navigateToRooms();

          // setTimeout(() => {
          //   this.generateCheckoutPDF();
          // }, 0);
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
    if(s.price){
      this.normalPayment.pulses = paid / s.price;
    }
     //console.log('In overAllCost > paid + this.usedPoints * s.price :>> ' );
     //console.log('overAllCost :>> ', overAllCost);
     //console.log('paid :>> ', paid);
    //console.log('usedPoints :>> ', this.usedPoints);
    if(!this.showRemainCash  ){
      this.usedPoints = 0;
    }
    if( overAllCost > paid + this.usedPoints * s.price )
    {
      //console.log(' paid + this.usedPoints * s.price  ',  paid + this.usedPoints * s.price );

      if(this.paymentsMethods.points[0] > overAllCost - paid +  this.usedPoints * s.price )
      {
        //console.log('In Show Points' );

        this.showPointsButton =true;

        return
       }

      else{
        //console.log('In Have No Points and Payment is less than' );

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
    //console.log( 'Now Current Payment' ,this.paymentsMethods)
    this.selectedCardIndex +=1;

  }
  payUsingRemainPoints(s:CompletedService){
    const paid =this.normalPayment.cash + this.normalPayment.vodafoneCash + this.normalPayment.visa + this.normalPayment.credit + this.normalPayment.instaPay + this.normalPayment.debit;
    //console.log('paid :>> ', paid);
    if(!this.showRemainCash){
      this.usedPoints = 0;
    }
    const pointService:PointsService ={
      serviceName:s.serviceName,
      numberOfPulses: (s.totalCost -paid)/s.price - this.usedPoints
    };
    this.paymentsMethods.points[0] -=  pointService.numberOfPulses;
    //console.log('pointService become :>> ', this.paymentsMethods.points[0]);
    this.paymentsMethods.normal.push(this.normalPayment);
    this.paymentsMethods.pointsService.push(pointService);
    this.updatePaidStatus(s.serviceName , true);
    //console.log( 'Now Current Payment' ,this.paymentsMethods);
    this.reset();
    this.selectedCardIndex +=1;
  }
  PayUsingPoints(s:CompletedService){
    //console.log('s.totalCost  :>> ', s.totalCost );
    //console.log('first.usedPoints  :>> ', this.usedPoints );
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
      numberOfPulses:this.usedPoints,
    };
    //console.log('Created pointsServie :>> ',pointService  );
    //console.log('CurrentPaymentMethods :>> ', this.paymentsMethods);
    this.paymentsMethods.points[0] -=  this.usedPoints;
    //console.log('C usedPoints:>> ', this.usedPoints);

    //console.log('CurrentPaymentMethods After decreasing usedPoints :>> ', this.paymentsMethods);

     this.paymentsMethods.pointsService.push(pointService);
     if(s.pulses !== this.usedPoints){
      this.showRemainCash = true;
       return;
     }
    this.updatePaidStatus(s.serviceName , true);
    this.reset();
    //console.log( 'Now Current Payment' ,this.paymentsMethods);
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
    //console.log( 'Now Current Payment' ,this.paymentsMethods);
    this.selectedCardIndex +=1;
  }

  updatePaidStatus(serviceName: string, paid: boolean): void {
    const serviceIndex = this.completedServices.findIndex(service => service.serviceName === serviceName);

    if (serviceIndex !== -1) {
      this.completedServices[serviceIndex].Paid = paid;
      //console.log(`Paid status updated for ${serviceName}: ${paid}`);
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
    //console.log(' TotalPoints  :>> ',   this.TotalPoints );
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

  generateCheckoutPDF(): void {
    const receiptElement = this.checkoutReceiptSection?.nativeElement;
    if (!receiptElement) {
      alert('No receipt data to export');
      this.navigateToRooms();
      return;
    }

    html2canvas(receiptElement, { scale: 2, useCORS: true, backgroundColor: '#fff' })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const logoImg = new Image();
        logoImg.onload = () => {
          // draw logo
          pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);

          // leave space for logo
          let y = 40;

          if (imgHeight > pdfHeight - y - 10) {
            let remainingHeight = imgHeight;
            let position = y;

            while (remainingHeight > 0) {
              pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
              remainingHeight -= pdfHeight - y;
              if (remainingHeight > 0) {
                pdf.addPage();
                position = 10;
              }
            }
          } else {
            pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
          }

          const dateStr = new Date().toISOString().split('T')[0];
          pdf.save(`checkout-${this.id}-${this.patientName}-${dateStr}.pdf`);
          this.navigateToRooms();

        };
        // ✅ make sure logo exists in assets
        logoImg.src = 'assets/logo.png';
      })
      .catch(() => {
        alert('Error generating PDF');
        this.navigateToRooms();

      });
  }


  getTotalPaid(): number {
    let total = 0;
    this.paymentsMethods.normal.forEach(p => {
      total += (p.cash || 0) + (p.visa || 0) + (p.vodafoneCash || 0) +
        (p.credit || 0) + (p.debit || 0) + (p.instaPay || 0);
    });
    return total;
  }
  navigateToRooms() {
    // console.log('naviagting to reservationwith phone:', phone)
    // this.router.navigate(['/receptionist/reservation', phone]);
     const roomsIndex = this.router.url.indexOf('rooms');
     const commonParentPath = this.router.url.substring(0, roomsIndex);
     this.router.navigate([commonParentPath, 'rooms']);
  }

}
