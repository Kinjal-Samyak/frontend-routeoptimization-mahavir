import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { DocumentsComponent } from './documents/documents.component';
import { StopsHistoryComponent } from './stops-history/stops-history.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { HistoryDetailsComponent } from './history-details/history-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MapHistoryComponent } from './map-history/map-history.component';
import { StopsModule } from '../stops/stops.module';
@NgModule({
    declarations: [
        HistoryComponent,
        DriverDetailsComponent,
        DocumentsComponent,
        StopsHistoryComponent,
        HistoryDetailsComponent,
        MapHistoryComponent,
    ],
    imports: [
        CommonModule,
        HistoryRoutingModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        StopsModule,
        MatInputModule,
        MatIconModule,
        HistoryRoutingModule,
        MatButtonModule,
        MatChipsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class HistoryModule {}
