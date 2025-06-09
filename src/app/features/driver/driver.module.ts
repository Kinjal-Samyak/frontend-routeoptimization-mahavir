import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversComponent } from './drivers/drivers.component';
import { DriverRoutingModule } from './driver-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadDataPopupComponent } from 'src/app/shared/component/upload-data-popup/upload-data-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { DragDropFileUploadDirective } from 'src/app/core/directives/drag-drop-file-uploads.directive';
import { ColumnMappingComponent } from '../../shared/component/column-mapping/column-mapping.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StopsModule } from '../stops/stops.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
@NgModule({
    declarations: [
        DriversComponent,
        UploadDataPopupComponent,
        DragDropFileUploadDirective,
        ColumnMappingComponent,
    ],
    imports: [
        CommonModule,
        DriverRoutingModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTooltipModule,
        StopsModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        NgxMaterialTimepickerModule,
    ],
    providers: [
        CommonService,
        AuthService,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DriverModule {}
