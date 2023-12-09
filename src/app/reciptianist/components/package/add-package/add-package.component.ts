import { Component, ViewEncapsulation ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PackageService } from 'src/app/reciptianist/services/package-service/package.service';
import { PatientService } from 'src/app/reciptianist/services/patient-server/patient.service';


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
    clinicName: 'NasrCity',
    cash:null ,
    visa:null,
    debit:null,
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
      this.filteredPackages = this.AllPackages;
    });
  }


  submit() {
    console.log('Form Data:', this.formData);
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
    this.filteredPackages = this.AllPackages.filter(AllPackages => AllPackages.toLowerCase().indexOf(value.toLowerCase()) !== -1);
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
