import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { HistoryService } from 'src/app/shared/services/history.service';

@Component({
    selector: 'app-history-details',
    templateUrl: './history-details.component.html',
    styleUrls: ['./history-details.component.scss'],
})
export class HistoryDetailsComponent implements OnInit, OnDestroy {
    // Define all child components
    documentDetails: any;
    driverDetails: any;
    stopDetails: any;
    routeDetails: any;

    // Subscription array
    subscriptions: Subscription[] = [];

    // Details of the driver history
    historyDetails: any;
    // Query params
    routeName: any;
    driverDetailsId: any;
    routeDate: any;
    routeID: any;

    constructor(
        private historyService: HistoryService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private commonService: CommonService
    ) {
        this.subscriptions.push(
            this.route.queryParams.subscribe((params) => {
                this.routeName = params['routename'];
                this.routeID = params['routeDetailsID'];
                this.driverDetailsId = params['driverDetailId'];
                this.routeDate = params['routeDate'];
            })
        );

        this.commonService.headerTitle.next('View History');
    }

    ngOnInit(): void {
        this.commonService.headerTitle.next('View History');
        this.getHistoryDetails();
    }

    getHistoryDetails() {
        let userReq = {
            driverDetailId: this.driverDetailsId,
            routeDetaiId: this.routeID,
        };

        this.subscriptions.push(
            this.historyService.getDriverHostryDetails(userReq).subscribe(
                (successData: any) => {
                    if (successData.code == 200) {
                        successData.data.driverDetailId = this.driverDetailsId;
                        successData.data.routeName = this.routeName;
                        successData.data.routeDate = this.routeDate;
                        this.documentDetails = successData.data;
                        this.driverDetails = successData.data;
                        this.stopDetails = successData.data;
                        this.routeDetails = successData.data;
                    }
                },
                (error: any) => {
                    this.toastr.error('History details', error.message);
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: any) =>
            subscription.unsubscribe()
        );
    }
}
