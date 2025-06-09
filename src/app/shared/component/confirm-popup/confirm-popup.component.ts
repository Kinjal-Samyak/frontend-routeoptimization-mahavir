import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-popup',
    templateUrl: './confirm-popup.component.html',
    styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent {
    title: any;
    message: any;
    btn1: any;
    btn2: any;

    constructor(
        public dialogRef: MatDialogRef<ConfirmPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data) {
            this.title = data.title;
            this.message = data.message;
            this.btn1 = data.btn1;
            this.btn2 = data.btn2;
        }
    }

    //Call on click Yes
    OnYes() {
        this.dialogRef.close('Y');
    }

    //Call on click No
    OnNo() {
        this.dialogRef.close('N');
    }
}
