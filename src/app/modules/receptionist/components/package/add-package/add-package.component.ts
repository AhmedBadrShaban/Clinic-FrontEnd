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
  AllNumbers:any[];
  filteredNumbers: string[] = [];
  AllPackages:any[];
  filteredPackages:string[]=[];
  constructor(private dialogRef: MatDialogRef<AddPackageComponent> ,  private patientservice: PatientService, private packageservice: PackageService) {

  }

  ngOnInit(): void {
    this.patientservice.getAllPatientsNumbers().subscribe((numbers: any) => {
      this.AllNumbers = numbers;
      console.log('patientNumbers :>> ', this.AllNumbers);
      this.filteredNumbers = this.AllNumbers;
    });

    this.packageservice.getAllPackages().subscribe((data: any) => {
      this.AllPackages = data;
      console.log('AllPackages :>> ', this.AllPackages);
      this.filteredPackages = this.AllPackages.map(pkg => pkg.packageName);
    });
  }


  submit() {
    console.log('Form Data:', this.formData);
    console.log('sum of Payments is :>> ',this.formData.cash + this.formData.vodafoneCash + this.formData.visa + this.formData.credit + this.formData.instaPay + this.formData.debit );
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
    {

    }
    this.packageservice.reservePackage(this.formData).subscribe(
      {
      next: (data) => {
        alert("PackageReserved")
        this.closeDialog();
        this.update()
        },
      error: (err) => {
        console.log("error in Reserve a Package ", err);
      }
     }
    );
  }


  onChange(value: string): void {
    this.filteredNumbers = this.AllNumbers.filter(AllNumbers => AllNumbers.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  onChange2(value: string): void {
    this.filteredPackages = this.AllPackages.map(pkg => pkg.packageName)
    .filter(packageName => packageName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    const selectedPackage = this.AllPackages.find(pkg => pkg.packageName === this.formData.packageName);
    this.formData.packageCost = selectedPackage ? selectedPackage.packageCost : '';
    console.log('cost of selected Package :>> ', this.formData.packageCost);
  }
  closeDialog() {
    this.dialogRef.close(AddPackageComponent);
  }
  update(){
    this.packageservice.getAllReservedPackages().subscribe((data:any)=>{
  // Update the parent component's listOfData
     this.packageservice.updateListOfData(data);
      console.log( "data Updated : " ,data);
    })
  }
}
