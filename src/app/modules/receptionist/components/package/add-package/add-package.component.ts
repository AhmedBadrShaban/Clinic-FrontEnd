import { ReservationsService } from './../../../services/reservations-services/reservations.service';
import { Component, ViewEncapsulation ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PackageService } from 'src/app/modules/receptionist/services/package-service/package.service';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';


@Component({
  selector: 'app-add-package',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})
export class AddPackageComponent {
  formData: any = {
    patientPhone: '',
    packageName: '',
    packageCost:'0',
     cash:null ,
    visa:null,
    debit:null,
    credit:null,
    instaPay:null,
    vodafoneCash:null,
   };
   allPatientsNamesAndNumbers: any[] = [];
  AllDataToSearchIn: any[] = [];
  filteredData: any[] = [];
  AllPackages:any[];
  searchValue?: any;
  patientNumber: any;
  filteredPackages:string[]=[];
  constructor(private dialogRef: MatDialogRef<AddPackageComponent> ,private namesAndNumbers : ReservationsService , private patientservice: PatientService, private packageservice: PackageService) {

  }

  ngOnInit(): void {

    this.namesAndNumbers.getPatientsNamesAndPhones().subscribe((data: any) => {
      this.allPatientsNamesAndNumbers = data;
       if (Array.isArray(this.allPatientsNamesAndNumbers)) {
        this.AllDataToSearchIn = this.allPatientsNamesAndNumbers;
        this.filteredData = this.AllDataToSearchIn;
      }
    });
    // this.patientservice.getAllPatientsNumbers().subscribe((numbers: any) => {
    //   this.AllNumbers = numbers;
    //   //console.log('patientNumbers :>> ', this.AllNumbers);
    //   this.filteredNumbers = this.AllNumbers;
    // });

    this.packageservice.getAllPackages().subscribe((data: any) => {
      this.AllPackages = data;
      //console.log('AllPackages :>> ', this.AllPackages);
      this.filteredPackages = this.AllPackages.map(pkg => pkg.packageName);
    });
  }


  submit() {
     //console.log('Form Data:', this.formData);

    //console.log('sum of Payments is :>> ',this.formData.cash + this.formData.vodafoneCash + this.formData.visa + this.formData.credit + this.formData.instaPay + this.formData.debit );
    if(this.formData.packageCost > this.formData.cash + this.formData.vodafoneCash + this.formData.visa + this.formData.credit + this.formData.instaPay + this.formData.debit)
    {
      alert("Total Payments Value is Less Than the Package Cost !! ")
      return;
    }
    else if (this.formData.packageCost < this.formData.cash + this.formData.vodafoneCash + this.formData.visa + this.formData.credit + this.formData.instaPay + this.formData.debit)
    {
      alert("Total Payments Value is More Than the Package Cost !! ")
      return;
    }
    this.formData.patientPhone =this.namesAndNumbers.extractPhoneNumberFromSearchResult(this.formData.patientPhone);
    this.packageservice.reservePackage(this.formData).subscribe(
      {
      next: (data) => {
        alert("PackageReserved")
        this.closeDialog();
        this.update()
        },
      error: (err) => {
        //console.log("error in Reserve a Package ", err);
      }
     }
    );
  }


  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(
      (AllDataToSearchIn) =>
        AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.searchValue = this.extractPhoneNumberFromSearchResult(this.filteredData[0]);
    //console.log('search Value :>> ', this.searchValue);
  }
  onChange2(value: string): void {
    this.filteredPackages = this.AllPackages.map(pkg => pkg.packageName)
    .filter(packageName => packageName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    const selectedPackage = this.AllPackages.find(pkg => pkg.packageName === this.formData.packageName);
    this.formData.packageCost = selectedPackage ? selectedPackage.packageCost : '';
    //console.log('cost of selected Package :>> ', this.formData.packageCost);
  }
  closeDialog() {
    this.dialogRef.close(AddPackageComponent);
  }
  update(){
    this.packageservice.getAllReservedPackages().subscribe((data:any)=>{
  // Update the parent component's listOfData
     this.packageservice.updateListOfData(data);
      //console.log( "data Updated : " ,data);
    })
  }
  extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
    const parts = selectedRecord.split('-');
    if (parts.length === 2) {
      //console.log('Number is Fn.. :>> ', parts[1]);
      return parts[1];
    }
    return selectedRecord;
  }
}
