import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Materials } from 'src/app/modules/admin/models/materials';
import { MaterialsService } from 'src/app/modules/admin/services/materials/materials.service';

@Component({
  selector: 'app-add-new-matrial',
  templateUrl: './add-new-matrial.component.html',
  styleUrls: ['./add-new-matrial.component.css']
})
export class AddNewMatrialComponent implements OnInit {

  selectedDate: any | undefined;
  newMaterialFm: FormGroup;
  flag:boolean=true;
  constructor(private fb: FormBuilder , private materialService:MaterialsService,  public dialogRef: MatDialogRef<AddNewMatrialComponent>) {
    this.newMaterialFm = fb.group({
      materialName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      quantity: ['', [Validators.required]],
      cost: ['', [Validators.required]],

    });
  }

  ngOnInit(): void {
  }

  submit() {
    let userModel:Materials=this.newMaterialFm.value as Materials;
    console.log(userModel);
    this.materialService.addMaterial(userModel).subscribe({
      next:(responed:any)=>{
         alert(responed.message);
         this.closeDialog();
         this.UpdateAllMaterials();
      },
      error: (err) => {
        alert(  err.error.message);
      }

    })
  }

  UpdateAllMaterials(){
    this.materialService.getAllMaterials().subscribe((data:any)=>{
      this.materialService.updateData(data);
      console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
