import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    constructor(
        private apiService: ApiService,
        private loadUrlService: LoadConfigurationsService
    ) {}

    // Get list of history of driver
    getHistoryList(id: any) {
        const url =
            this.loadUrlService.serviceUrl('routeTrackingAPI') +
            '/history/' +
            id;

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Get history details of driver
    getDriverHostryDetails(data: any) {
        const url =
            this.loadUrlService.serviceUrl('routeTrackingAPI') + '/history';

        return this.apiService.postWithAuth(url, data).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Get history details of driver
    getDocument(data: any) {
        const url =
            this.loadUrlService.serviceUrl('fileUpload') +
            '/upload/RouteStopDownload';

        return this.apiService.postWithAuth(url, data).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
}
