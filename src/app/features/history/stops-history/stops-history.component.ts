import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-stops-history',
    templateUrl: './stops-history.component.html',
    styleUrls: ['./stops-history.component.scss'],
})
export class StopsHistoryComponent implements OnInit {
    @Input() childData: any;
    // Mat table data source to manage data
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    displayedColumns = ['no', 'stop', 'name', 'contact', 'adress', 'arival'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor() {}

    ngOnInit(): void {
        if (this.childData) {
            this.setUpStopHistory();
        }
    }

    setUpStopHistory() {
        this.dataSource = new MatTableDataSource(this.childData.stops);
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Set the paginator and sort after the view init since this component will
     * be able to query its view for the initialized paginator and sort.
     */
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
}
