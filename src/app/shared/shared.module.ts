import { CommonModule } from '@angular/common';
import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ApiService } from './services/api.service';

import { ConstarintsPopupComponent } from './component/constarints-popup/constarints-popup.component';
import { StopsModule } from '../features/stops/stops.module';
import { AddStopComponent } from './component/add-stop/add-stop.component';
import { ConfirmPopupComponent } from './component/confirm-popup/confirm-popup.component';
import { StopDetailsComponent } from './component/stop-details/stop-details.component';

@NgModule({
    declarations: [
        ConstarintsPopupComponent,
        AddStopComponent,
        ConfirmPopupComponent,
        StopDetailsComponent,
    ],
    imports: [CommonModule, StopsModule],
    exports: [],
    providers: [ApiService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
