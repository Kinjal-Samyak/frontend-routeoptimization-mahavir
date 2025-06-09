import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-add-stop',
    templateUrl: './add-stop.component.html',
    styleUrls: ['./add-stop.component.scss'],
})
export class AddStopComponent implements OnInit {
    // Define the reactive from
    reactiveForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddStopComponent>
    ) {
        this.reactiveForm = this.fb.group({
            stop: ['', Validators.required],
            companyName: ['', Validators.required],
            addressLine1: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['', Validators.required],
            stop2: ['', Validators.required],
            companyName2: ['', Validators.required],
            addressLine12: ['', Validators.required],
            city2: ['', Validators.required],
            state2: ['', Validators.required],
            zip2: ['', Validators.required],
            country2: ['', Validators.required],
        });
    }

    onSubmit() {
        if (this.reactiveForm.valid)
            this.dialogRef.close({ data: this.reactiveForm.value });
        else if (this.reactiveForm.invalid)
            this.reactiveForm.markAllAsTouched();
    }
    ngOnInit(): void {}
    onNoClick() {}

    // inputField() {
    //     this.reactiveForm.patchValue({
    //         companyName: `ST. JOE'S MED CENTER JOLIET`,
    //         addressLine1: `333 NORTH MADISON`,
    //         city: `JOLIET`,
    //         state: `IL`,
    //         zip: `60435`,
    //         country: `USA`,
    //         stop2: `12`,
    //         companyName2: `SILVER CROSS HOSPITAL`,
    //         addressLine12: `1900 Silver Cross Blvd`,
    //         city2: `NEW LENOX`,
    //         state2: `IL`,
    //         zip2: `60451`,
    //         country2: `USA`,
    //     });
    // }
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    user: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, user: 1 },
    { position: 2, name: 'Helium', weight: 4.0026, user: 2 },
    { position: 3, name: 'Lithium', weight: 6.941, user: 3 },
];
