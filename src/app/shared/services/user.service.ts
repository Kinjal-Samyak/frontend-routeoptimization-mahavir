import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private apiService: ApiService,
        private loadUrlService: LoadConfigurationsService
    ) {}
    // Register API service
    register(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('userAPI') + `/users`;

        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    resetPassword(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('userAPI') + `/password/reset`;

        return this.apiService.put(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    isExpired(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('userAPI') + `/password`;

        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    forgotPassword(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('userAPI') + `/password/forgot`;

        return this.apiService.put(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    getContryList() {
        const url = this.loadUrlService.serviceUrl('userAPI') + '/country';

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
}
