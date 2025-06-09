import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopsRoutingModule } from './stops-routing.module';
import { StopsComponent } from './stops.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GenericPopupComponent } from 'src/app/shared/component/generic-popup/generic-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
@NgModule({
  declarations: [StopsComponent, GenericPopupComponent],
  imports: [
    CommonModule,
    StopsRoutingModule,
    DragDropModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatRadioModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxMatDatetimePickerModule,
    MatSliderModule,
    NgxMatNativeDateModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
    MatBadgeModule,
  ],
  exports: [
    MatSliderModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    DragDropModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatCheckboxModule,
    GenericPopupComponent,
    MatRadioModule,
    MatToolbarModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    MatMomentDateModule,
    NgxMatDatetimePickerModule,
    MatAutocompleteModule,
    StopsRoutingModule,
    DragDropModule,
    MatBadgeModule,
    NgxMaterialTimepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopsModule {}
