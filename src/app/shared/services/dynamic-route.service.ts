import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class DynamicRouteService {
    constructor(private apiServ: ApiService) {}

    // Calling the API11 to get the route data
    sendDetails(data: any) {
        return this.apiServ
            .postWithAuth(`${environment.url + '/api11'}`, data)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }

    // Reset data from db
    ResetData(data: any) {
        const headerParams = new HttpHeaders({
            'API-UserName': 'mnxdashboard',
            'API-Password': 'L0nGbe@(h15',
            'Content-type': 'application/json',
        });

        return this.apiServ
            .post(
                `${environment.csvFileUrl + 'ResetJobListForRouteService'}`,
                data,
                { headers: headerParams }
            )
            .pipe(
                map((res: any) => {
                    if (res) {
                        console.log(res);
                    }
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }

    // Calling the get driver list api
    getDriverList() {
        return this.apiServ
            .get(`${environment.driverAPI + '/drivers/list'}`)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }

    // Calling the API11 to get the route data
    getExtraStopsDetails(data1: any) {
        // Create formData to post two files
        let formData = new FormData();

        // create a Blob object from the file
        const fileBlob1 = new Blob([data1]);

        formData.append('file1', fileBlob1);

        return this.apiServ
            .postWithAuth(`${environment.url + '/addstops'}`, formData)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }

    getRouteDetails(data: any) {
        const headerParams = new HttpHeaders({
            'API-UserName': 'mnxdashboard',
            'API-Password': 'L0nGbe@(h15',
            'Content-type': 'application/json',
        });

        return this.apiServ
            .post(
                `${environment.csvFileUrl + 'GetJobListForRouteService'}`,
                data,
                { headers: headerParams }
            )
            .pipe(
                map((res: any) => {
                    if (res) {
                        console.log(res);
                    }
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }

    // Get route-optimization details using id
    getOptimizedRouteDetails(data: any) {
        return this.apiServ
            .postWithAuth(`${environment.routeoptimizationUrl + 'Route'}`, data)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }

    getJson2FileDetails(data: any) {
        const headerParams = new HttpHeaders({
            'API-UserName': 'mnxdashboard',
            'API-Password': 'L0nGbe@(h15',
            'Content-type': 'application/json',
        });

        return this.apiServ
            .post(
                'http://stagingna.nglog.com/CustomerCSVService/Report/GetJobListForRouteService',
                data,
                { headers: headerParams }
            )
            .pipe(
                map((res: any) => {
                    if (res) {
                        console.log(res);
                    }
                    return res;
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            );
    }
}
