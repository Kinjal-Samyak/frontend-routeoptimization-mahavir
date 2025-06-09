import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class DriverService {
    constructor(
        private apiService: ApiService,
        private loadUrlService: LoadConfigurationsService
    ) {}

    deleteDriver(Id: any) {
        const url = this.loadUrlService.serviceUrl('driverAPI') + '/drivers/';
        return this.apiService.delete(`${url + Id}`).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    //Driver List
    getProjectList(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('pythonUrl') + 'fetch_projects';

        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
    // Add(Insert) Driver
    addProject(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('pythonUrl') + 'optimize';
        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

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
    // Update Driver
    updateDriver(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('driverAPI') + '/drivers';

        return this.apiService.put(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    getByIdDriver(Id: any) {
        const url = this.loadUrlService.serviceUrl('driverAPI') + '/drivers/';
        return this.apiService.get(`${url + Id}`).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    countryDropdown() {
        const url = this.loadUrlService.serviceUrl('driverAPI') + '/GetCountry';

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Partking Time
    partkingTime(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('driverAPI') + '/PartkingTime';

        return this.apiService.put(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Upoload document service
    uploadDoc(userReq: any) {
        const url =
            this.loadUrlService.serviceUrl('fileUpload') +
            '/upload/driverdetail';

        return this.apiService.postWithAuth(url, userReq).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    getDriversList() {
        const url =
            this.loadUrlService.serviceUrl('driverAPI') + '/drivers/list';

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
