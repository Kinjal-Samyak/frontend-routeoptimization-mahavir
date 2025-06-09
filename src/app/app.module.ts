import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStoreService } from './shared/services/local-store.service';
import { AppComponent } from './app.component';
import {
    HttpClientJsonpModule,
    HttpClientModule,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { DynamicRouteMapComponent } from './features/dynamic-route-map/dynamic-route-map.component';
import { StopsModule } from './features/stops/stops.module';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptors';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { DynamicRouteComponent } from './features/dynamic-route/dynamic-route.component';
import { DynamicRouteIdComponent } from './features/dynamic-route-id/dynamic-route-id.component';
import { RouteMapComponent } from './features/route-map/route-map.component';
import { TrackingScreenComponent } from './features/tracking-screen/tracking-screen.component';
import { LiveTrackingComponent } from './features/live-tracking/live-tracking.component';
import { LoadConfigurationsService } from './shared/services/load-configurations.service';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

//import { AuthService } from './shared/services/auth.service';
@NgModule({
    declarations: [
        AppComponent,
        DynamicRouteMapComponent,
        DynamicRouteComponent,
        DynamicRouteIdComponent,
        RouteMapComponent,
        TrackingScreenComponent,
        LiveTrackingComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        HttpClientModule,
        StopsModule,
        GoogleMapsModule,
        HttpClientJsonpModule,
        ToastrModule.forRoot({
            // progressBar: true,
        }), // ToastrModule added
    ],
    exports: [],
    providers: [
        LocalStoreService,
        {
            provide: APP_INITIALIZER,
            useFactory: (configService: LoadConfigurationsService) => () =>
                configService.loadConfigService(),
            deps: [LoadConfigurationsService],
            multi: true,
        },

        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        DatePipe, // Add DatePipe to the providers array
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
