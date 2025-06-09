import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { StopService } from '../../services/stop.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-stop-details',
    templateUrl: './stop-details.component.html',
    styleUrls: ['./stop-details.component.scss'],
})
export class StopDetailsComponent implements OnInit {
    // Reactive form gourp
    reactiveForm: FormGroup;
    stopDetails: any;

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialogRef<StopDetailsComponent>,
        public dialogRef: MatDialog,
        private stopService: StopService,
        private toastr: ToastrService,

        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // this.reactiveFormArray.push(this.reactiveForm);
        this.reactiveForm = this.fb.group({
            routeId: [''],
            name: [''],
            contactNo: [''],
            stopTime: [''],
            parkingTime: [''],
            breakTime: [''],
            waitTime: [''],
            address: [''],
            remark: [''],
            status: [''],
            type: [''],
            estArvTime: [''],
            issueReason: [''],
        });

        if (data) {
            this.getOrderDetails(data);
        }
    }

    // Function to extract time from a date string
    extractTime(dateTime: string): string {
        const date = new Date(dateTime);
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        return `${hours}:${minutes}`;
    }

    // Helper function to pad single digit numbers with a leading zero
    padZero(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }

    //Get the detail of the order
    getOrderDetails(routeStopDetail: any) {
        let user = {
            routeStopDetailId: routeStopDetail.routeStopDetailId,
            driverDetailId: routeStopDetail.driverDetailId,
        };
        this.stopService.getStopDetails(user).subscribe(
            (successData: any) => {
                if (successData) {
                    this.stopDetails = successData.data;

                    const fromBreakTime = this.stopDetails?.fromBreakTime;
                    const toBreakTime = this.stopDetails?.toBreakTime;

                    let breakTime;

                    if (fromBreakTime && toBreakTime) {
                        const fromTime = this.extractTime(fromBreakTime);
                        const toTime = this.extractTime(toBreakTime);
                        breakTime = `${fromTime} - ${toTime}`;
                    } else {
                        breakTime = '-';
                    }

                    this.reactiveForm.patchValue({
                        routeId: this.stopDetails?.routeStopDetailId,
                        name: this.stopDetails?.name,
                        contactNo: this.stopDetails?.contactNo,
                        stopTime:
                            this.stopDetails?.fromTime +
                            ' - ' +
                            this.stopDetails?.toTime,

                        parkingTime: this.stopDetails?.parkingTime,
                        breakTime: breakTime,
                        waitTime: this.stopDetails?.driverWaitTime,
                        address:
                            this.stopDetails?.address +
                            ', ' +
                            this.stopDetails?.city +
                            ', ' +
                            this.stopDetails?.state +
                            ', ' +
                            this.stopDetails?.countryId,
                        remark: this.stopDetails?.remark || '-',
                        type: this.stopDetails?.type,
                        status: this.stopDetails?.status,
                        estArvTime: this.stopDetails?.estVisitDatetime,
                        issueReason:
                            this.stopDetails?.problemStatus?.toString(),
                    });
                    this.reactiveForm.disable();
                }
            },
            (error: any) => {
                this.toastr.error('Error', error.message);
            }
        );
    }

    closDialog() {
        this.dialog.close({ event: 'success' });
    }
    ngOnInit(): void {}
}
