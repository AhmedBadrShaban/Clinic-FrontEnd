import { Component, ViewEncapsulation ,Inject ,OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialsService } from 'src/app/modules/admin/services/materials/materials.service';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  addProductFm: FormGroup;
  selectedProduct:any;
  patientNumber: any;
  allPatientsNamesAndNumbers: any[] = [];
  AllDataToSearchIn: any[] = [];
  filteredData: any[] = [];
  AllProducts:any[]=[];
  filteredProducts:string[]=[];
  searchValue?: any;
  constructor(private dialogRef: MatDialogRef<AddProductComponent> ,private fb: FormBuilder,private namesAndNumbers :ReservationsService, private patientservice: PatientService, private productservice: MaterialsService) {
    this.addProductFm = fb.group({
      patientPhone: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      cash: null,
      visa: null,
      vodafoneCash: null,
      instaPay: null,
      credit: null,
      total: null,
      products: fb.array([this.createProductFormGroup()]),
    });
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
    //   console.log('patientNumbers :>> ', this.AllNumbers);
    //   this.filteredNumbers = this.AllNumbers;
    // });

    this.productservice.getAllMaterials().subscribe((data: any) => {
      this.AllProducts = data;
      console.log('AllProuducts :>> ', this.AllProducts);
      this.filteredProducts = this.AllProducts.map(pk => pk.materialName);
    });
  }


  submit() {
    let userModel=this.addProductFm.value ;
    console.log('Form Data:', userModel);
    console.log('sum of Payments is :>> ',userModel.cash + userModel.vodafoneCash + userModel.visa + userModel.credit + userModel.instaPay );
    if(userModel.total > userModel.cash + userModel.vodafoneCash + userModel.visa + userModel.credit + userModel.instaPay)
    {
      alert("Total Payments Value is Less Than the Total Cost !! ")
      return;
    }
    else if (userModel.total < userModel.cash + userModel.vodafoneCash + userModel.visa + userModel.credit + userModel.instaPay)
    {
      alert("Total Payments Value is More Than the Total Cost !! ")
      return;
    }
    userModel.patientPhone = this.searchValue;
    this.productservice.addProuduct(userModel).subscribe(
      {
      next: (data:any) => {
        alert(data.message)
        this.closeDialog();
         },
      error: (err) => {
       alert(err.error.message);
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
  console.log('search Value :>> ', this.searchValue);
  }


  updatePrice(index: number): void {
    const productNameControl = this.Products.at(index).get('productName');
    const amountControl = this.Products.at(index).get('amount');
    const priceControl = this.Products.at(index).get('price');
    const total = this.addProductFm.get('total');

    if (productNameControl && amountControl && priceControl) {
      const selectedProduct = productNameControl.value;
      const product = this.AllProducts.find(p => p.materialName === selectedProduct);

      if (product) {
        const amount = amountControl.value;
        const cost = product.cost;

        // Calculate and update the price field
        priceControl.setValue(amount * cost);
      }
    }
    this.updateTotal();
  }

  updateTotal() {
    const totalControl = this.addProductFm.get('total');
    if (totalControl) {
      const total = this.Products.controls.reduce((acc, control) => {
        const price = control.get('price')?.value ?? 0;
        return acc + price;
      }, 0);

      // Update the total field
      totalControl.setValue(total);
    }
  }

  get Products()
  {
    return this.addProductFm.get('products') as FormArray;
  }

  addProduct(event: any) {
    this.Products.push(this.createProductFormGroup());
    event.target?.classList.add('d-none');
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      amount: [1, Validators.required],
      price: [null, Validators.required],
    });
  }
  closeDialog() {
    this.dialogRef.close(AddProductComponent);
  }
  extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
    const parts = selectedRecord.split('-');
    if (parts.length === 2) {
      console.log('Number is Fn.. :>> ', parts[1]);
      return parts[1];
    }
    return selectedRecord;
  }


}
