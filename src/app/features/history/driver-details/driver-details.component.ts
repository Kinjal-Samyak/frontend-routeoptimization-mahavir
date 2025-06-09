import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-driver-details',
    templateUrl: './driver-details.component.html',
    styleUrls: ['./driver-details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
    @Input() childData: any;

    // Details of driver
    driverDetails: any;
    constructor() {}

    ngOnInit(): void {
        if (this.childData) {
            this.driverDetails = this.childData;
        }
    }
}
