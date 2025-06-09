import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class StopService {
    constructor(
        private apiService: ApiService,
        private loadUrlService: LoadConfigurationsService
    ) {}

    deleteStops(data: any) {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/stops';
        return this.apiService.deleteWithBody(url, data).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
    //Stop List
    getStopList(Id: any) {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/routes/' + Id;

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Details of the order
    getStopDetails(reqObj: any) {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') +
            '/stops/RouteStopDriverDetail';

        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Add(Insert) Stop
    addStop(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/stops';

        return this.apiService.postWithAuth(url, reqObj).pipe(
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
            this.loadUrlService.serviceUrl('stopAPI') + '/stops/ParkingTime';

        return this.apiService.put(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Update Stop
    updateStop(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/stops';

        return this.apiService.put(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    getByIdStop(Id: any) {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/stops/' + Id;

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    projectList() {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/routes';

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Add(Insert) project
    saveProject(reqObj: any) {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/routes';

        return this.apiService.postWithAuth(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    countryDropdown() {
        const url = this.loadUrlService.serviceUrl('stopAPI') + '/stops';

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    stateDropdown() {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') + '/stops/GetState';

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    cityDropdown() {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') + '/stops/GetCity';
        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Post Optimize route service
    optimizeRoute(userReq: any) {
        const url =
            this.loadUrlService.serviceUrl('optimizeRoute') + '/optimizeroute';

        return this.apiService.postWithAuth(url, userReq).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    optimizeRouteAddstops(userReq: any) {
        const url =
            this.loadUrlService.serviceUrl('optimizeRoute') +
            '/optimizeroute/addstop';

        return this.apiService.postWithAuth(url, userReq).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Get the list of Interdependent stops list
    getInterDependentStopsList(routeId: any, param: any) {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') +
            '/stops/list/' +
            routeId +
            '/' +
            param;

        return this.apiService.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Get all assignd driver list
    getAssignedDriverList(id: any) {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') +
            '/stopsconstrain/assigndriver/' +
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

    // Post assigned driver details
    postAssignedDriverList(userReq: any) {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') +
            '/stopsconstrain/assigndriver';

        return this.apiService.postWithAuth(url, userReq).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Post assigned stops details
    postInterDependencyStops(userReq: any) {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') +
            '/stopsconstrain/interdependencystops';

        return this.apiService.postWithAuth(url, userReq).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Get selected address
    getSelectedInterDependentStops(id: any) {
        const url =
            this.loadUrlService.serviceUrl('stopAPI') +
            '/stopsconstrain/interdependencystops/' +
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
}
