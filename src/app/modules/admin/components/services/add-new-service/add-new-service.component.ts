import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BillingModel, Service } from 'src/app/modules/admin/models/service';
import { ServiceService } from 'src/app/modules/admin/services/services/service.service';

export interface AddNewServiceDialogData {
  service?: Service | null;
}

@Component({
  selector: 'app-add-new-service',
  templateUrl: './add-new-service.component.html',
  styleUrls: ['./add-new-service.component.css']
})
export class AddNewServiceComponent implements OnInit {
  newServiceFm: FormGroup;
  flag: boolean = true;
  allRooms: any;
  editing: boolean = false;
  serviceId?: number;

  constructor(
    private fb: FormBuilder,
    private serService: ServiceService,
    private dialogRef: MatDialogRef<AddNewServiceComponent>,
    @Inject(MAT_DIALOG_DATA) private data?: AddNewServiceDialogData
  ) {
    this.newServiceFm = fb.group({
      serviceName: ['', [Validators.required, Validators.pattern('[A-Za-z0-9 ]*')]],
      costPerSession: ['', [Validators.required]],
      rooms: [[], [Validators.required]],
      billingModel: ['none'],
      fixedDoctorFee: [null],
      materialCost: [null],
      doctorPercentage: [null],
    });
  }

  ngOnInit(): void {
    this.serService.getAllRooms().subscribe((data) => {
      this.allRooms = data;
    });

    const service = this.data?.service;
    if (service) {
      this.editing = true;
      this.serviceId = Number(service.patientServiceId);
      this.newServiceFm.patchValue({
        serviceName: service.serviceName,
        costPerSession: service.costPerSession,
        rooms: (service.rooms ?? []).map((r: any) => r?.roomName ?? r),
        billingModel: this.resolveBillingModel(service),
        fixedDoctorFee: service.fixedDoctorFee ?? null,
        materialCost: service.materialCost ?? null,
        doctorPercentage: service.doctorPercentage ?? null,
      });
    }

    this.newServiceFm.get('billingModel')!.valueChanges.subscribe(() => this.syncBillingControls());
    this.syncBillingControls();
  }

  private resolveBillingModel(service: Service): BillingModel {
    if (service.fixedDoctorFee != null) return 'fixed';
    if (service.materialCost != null || service.doctorPercentage != null) return 'percentage';
    return 'none';
  }

  private syncBillingControls(): void {
    const model = this.newServiceFm.get('billingModel')!.value;
    if (model === 'fixed') {
      this.newServiceFm.get('fixedDoctorFee')!.enable();
      this.newServiceFm.get('materialCost')!.disable();
      this.newServiceFm.get('doctorPercentage')!.disable();
    } else if (model === 'percentage') {
      this.newServiceFm.get('fixedDoctorFee')!.disable();
      this.newServiceFm.get('materialCost')!.enable();
      this.newServiceFm.get('doctorPercentage')!.enable();
    } else {
      this.newServiceFm.get('fixedDoctorFee')!.disable();
      this.newServiceFm.get('materialCost')!.disable();
      this.newServiceFm.get('doctorPercentage')!.disable();
    }
  }

  submit() {
    const raw = this.newServiceFm.getRawValue();
    const model: BillingModel = raw.billingModel;

    let fixedDoctorFee: number | null = null;
    let materialCost: number | null = null;
    let doctorPercentage: number | null = null;

    if (model === 'fixed') {
      fixedDoctorFee = raw.fixedDoctorFee != null ? Number(raw.fixedDoctorFee) : 0;
    } else if (model === 'percentage') {
      materialCost = raw.materialCost != null ? Number(raw.materialCost) : 0;
      doctorPercentage = raw.doctorPercentage != null ? Number(raw.doctorPercentage) : 0;
    }

    if (this.editing && this.serviceId != null) {
      this.submitUpdate(raw, fixedDoctorFee, materialCost, doctorPercentage);
      return;
    }

    this.submitCreate(raw, fixedDoctorFee, materialCost, doctorPercentage);
  }

  private submitCreate(raw: any, fixedDoctorFee: number | null, materialCost: number | null, doctorPercentage: number | null): void {
    const payload = {
      serviceName: raw.serviceName,
      costPerSession: Number(raw.costPerSession),
      rooms: raw.rooms,
      fixedDoctorFee,
      materialCost,
      doctorPercentage,
    };
    this.serService.addService(payload).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.closeDialog();
        this.update();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Failed to add service';
        alert(msg);
      }
    });
  }

  private submitUpdate(raw: any, fixedDoctorFee: number | null, materialCost: number | null, doctorPercentage: number | null): void {
    const payload: any = {
      serviceName: raw.serviceName,
      costPerSession: Number(raw.costPerSession),
      fixedDoctorFee,
      materialCost,
      doctorPercentage,
      rooms: (raw.rooms ?? []).map((roomName: string) => ({ roomName })),
    };
    this.serService.updateService(this.serviceId!, payload).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.closeDialog();
        this.update();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Failed to update service';
        alert(msg);
      }
    });
  }

  update() {
    this.serService.getAllServices().subscribe((data) => {
      this.serService.updateData(data);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
