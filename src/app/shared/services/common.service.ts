import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    catchError,
    map,
    of,
    throwError,
} from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor(
        private apiServ: ApiService,
        private loadUrlService: LoadConfigurationsService
    ) {}

    // Observables
    public headerTitle: BehaviorSubject<string> = new BehaviorSubject<string>(
        'Diver-Management'
    );

    // Observables for storing the optimize route details
    public optimizeRouteDetails: BehaviorSubject<any> =
        new BehaviorSubject<any>('');

    // Observables for sending centers
    public centerLocation: BehaviorSubject<string> =
        new BehaviorSubject<string>('');

    public currentApiStatus: BehaviorSubject<Boolean> =
        new BehaviorSubject<Boolean>(false);

    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    show() {
        this.isLoading.next(true);
    }

    hide() {
        this.isLoading.next(false);
    }
    getColumns(type: string) {
        if (type == 'driver') {
            return of([
                {
                    displayValue: [
                        'name',
                        'address',
                        'contactNo',
                        'altContactNo',
                        'email',
                        'breakTimeFrom',
                        'breakTimeTo',
                        'shiftingTimeFrom',
                        'shiftingTimeTo',
                    ],
                    displayName: [
                        'Name',
                        'Address',
                        'Contact No',
                        'Alt Contact No',
                        'Email',
                        'Break Time From',
                        'Break Time To',
                        'Shifting Time From',
                        'Shifting Time To',
                    ],
                },
            ]);
        } else if (type == 'stop') {
            return of([
                {
                    displayValue: [
                        'name',
                        'address',
                        'city',
                        'state',
                        'zipcode',
                        'contactNo',
                        'type',
                        'time',
                    ],
                    displayName: [
                        'Name',
                        'Address',
                        'City',
                        'State',
                        'ZipCode',
                        'Contact No',
                        'Type',
                        'Parking Time',
                    ],
                },
            ]);
        } else {
            return of([
                {
                    displayValue: [
                        'name',
                        'address',
                        'city',
                        'state',
                        'zipcode',
                        'contactNo',
                        'type',
                        'time',
                    ],
                    displayName: [
                        'Name',
                        'Address',
                        'City',
                        'State',
                        'ZipCode',
                        'Contact No',
                        'Type',
                        'Parking Time',
                    ],
                },
            ]);
        }
    }

    // Upoload document service
    uploadDoc(userReq: any, type: string) {
        const url =
            this.loadUrlService.serviceUrl('fileUpload') + `/upload/` + type;

        return this.apiServ.postWithAuth(url, userReq).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Colum mapping data api
    getMapColumnData(type: string) {
        const url =
            this.loadUrlService.serviceUrl('fileUpload') +
            `/mapcolumnheader/` +
            type;

        return this.apiServ.get(url).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Post all coloumns api
    PostMapColumnData(Data: any, type: string) {
        const url =
            this.loadUrlService.serviceUrl('fileUpload') +
            `/mapcolumnheader/` +
            type;

        return this.apiServ.postWithAuth(url, Data).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Import data from api
    importData(Data: any, type: string) {
        const url =
            this.loadUrlService.serviceUrl('fileUpload') + '/import/' + type;

        return this.apiServ.postWithAuth(url, Data).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
}
