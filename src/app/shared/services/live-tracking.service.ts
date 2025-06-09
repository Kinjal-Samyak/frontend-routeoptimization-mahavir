import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class LiveTrackingService {
    constructor(
        private apiService: ApiService,
        private loadUrlService: LoadConfigurationsService
    ) {}
    projectStatus(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('pythonUrl') + 'project_status';
        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
    searchDriver(Id: any) {
        const url =
            this.loadUrlService.serviceUrl('routeTrackingAPI') +
            '/routetracking/';
        return this.apiService.get(`${url + Id}`).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Calling the get driver list api
    getDriverList() {
        const url =
            this.loadUrlService.serviceUrl('driverAPI') +
            '/Driver/GetAllDrivers';

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    getCompletedRoute(routeData: any) {
        const url =
            this.loadUrlService.serviceUrl('routeTrackingAPI') +
            '/routetracking/LiveTracking';
        return this.apiService.postWithAuth(url, routeData).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    publishRoute(routeId: any) {
        const url =
            this.loadUrlService.serviceUrl('optimizeRoute') +
            '/publishroute?routeDetailId=' +
            routeId;

        return this.apiService.postWithAuth(url, {}).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    saveRouteDetails(routeDetails: any) {
        const url =
            this.loadUrlService.serviceUrl('optimizeRoute') + '/publishroute';

        return this.apiService.postWithAuth(url, routeDetails).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Add(Insert) Stop
    optimizeaddstop(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('optimizeRoute') +
            '/optimizeaddstop';

        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
}
