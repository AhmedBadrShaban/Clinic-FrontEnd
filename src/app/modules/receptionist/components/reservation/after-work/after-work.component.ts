import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-after-work',
    templateUrl: './after-work.component.html',
    styleUrls: ['./after-work.component.css']
})
export class AfterWorkComponent implements OnInit {

    reservationServices: string[] = [
        'Full legs',
        'Arms'
    ];

    doneServicesForm = new FormGroup({
        dataList: new FormArray([])
    });

    get dataListControls() {
        return (this.doneServicesForm.get('dataList') as FormArray).controls;
    }

    ngOnInit(): void {
        for (const service of this.reservationServices) {
            const serviceFormGroup = new FormGroup({
                serviceName: new FormControl(service, Validators.required),
                Pulses: new FormControl(0, Validators.min(0)),
                Spot: new FormControl(0, Validators.min(0)),
                Flunce1: new FormControl(0, Validators.min(0)),
                Flunce2: new FormControl(0, Validators.min(0)),
                notes: new FormControl('')
            });
            (this.doneServicesForm.get('dataList') as FormArray).push(serviceFormGroup);
        }
    }
    onCancel( index : number): void {
        (this.doneServicesForm.get('dataList') as FormArray).removeAt(index)
    }
    onSubmit(){
        console.log(this.doneServicesForm.value)
    }
}
