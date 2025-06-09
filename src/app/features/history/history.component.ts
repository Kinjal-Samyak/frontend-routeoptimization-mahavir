import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { HistoryService } from 'src/app/shared/services/history.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
    // Display columns of the data table
    displayedColumns = [
        'driverName',
        'driverId',
        'deliveryDate',
        'shiftTime',
        'action',
    ];

    // Data source of the mat-table data
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    // Paginator for data table
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // History list
    historyList: any;
    subscriptions: Subscription[] = [];

    // show if there is no data on search
    noDataDisplay: boolean = false;

    constructor(
        public historyService: HistoryService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.getHistoryDataList();
    }

    // filter and serch the driver
    applyFilter(e: any) {
        const filterValue = (e.target as HTMLInputElement).value;
        if (filterValue != '' && filterValue != null) {
            this.dataSource.filter = filterValue.trim().toLowerCase();
            if (this.dataSource.filteredData.length === 0) {
                //  this.dataSource = new MatTableDataSource();
                this.noDataDisplay = true;
            }
        } else {
            this.getHistoryDataList();
        }
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // Get all history data list
    getHistoryDataList() {
        this.subscriptions.push(
            this.historyService.getHistoryList(50).subscribe(
                (successData: any) => {
                    if (successData.code == 200) {
                        this.historyList = successData.data;
                        setTimeout(() => {
                            this.dataSource = new MatTableDataSource(
                                this.historyList
                            );
                            this.dataSource.paginator = this.paginator;
                        }, 60);
                    }
                },
                (error: any) => {
                    this.toastr.error('History list', error);
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
