import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/core/layout/header/header.component';
import { SidebarComponent } from 'src/app/core/layout/sidebar/sidebar.component';
import { MainlayoutComponent } from 'src/app/core/layout/mainlayout.component';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { StopsModule } from '../stops/stops.module';

@NgModule({
    declarations: [MainlayoutComponent, SidebarComponent, HeaderComponent],
    imports: [CommonModule, HomeRoutingModule, HttpClientModule, StopsModule],
    providers: [AuthService, ApiService],
})
export class HomeModule {}
