import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamicRouteService } from 'src/app/shared/services/dynamic-route.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-dynamic-route-map',
    templateUrl: './dynamic-route.component.html',
    styleUrls: ['./dynamic-route.component.scss'],
})
export class DynamicRouteComponent implements OnInit {
    serviceUrl = environment.url;
    firstUrl = 'http://developer.samyakinfo.com';

    sendEmptyArray: boolean = true;
    // -----------------Market Places -------------------------
    marketPlace: any = [
        { CustCode: 950794, BranchName: 'ANC East Hartford (F01)' },
        { CustCode: 950853, BranchName: 'Austin Hub' },
        { CustCode: 950764, BranchName: 'Houston Metro (F52)' },
        { CustCode: 950747, BranchName: 'Los Angeles (F44)' },
        { CustCode: 950677, BranchName: 'Mid Atlantic Hanover (F11)' },
        { CustCode: 950793, BranchName: 'New York Metro (F05)' },
        { CustCode: 950847, BranchName: 'North Texas (F25)' },
        {
            CustCode: 950837,
            BranchName: 'Northern California Sacramento (F34)',
        },
        { CustCode: 950856, BranchName: 'Oklahoma OKC (F27)' },
        { CustCode: 950788, BranchName: 'South Texas Austin (F24)' },
        { CustCode: 950852, BranchName: 'South Texas El Paso (F24)' },
        { CustCode: 950853, BranchName: 'South Texas San Antonio (F24)' },
        { CustCode: 950643, BranchName: 'Southern California Anaheim (F37)' },
        { CustCode: 950861, BranchName: 'Steel Mountain Brecksville (F08)' },
        { CustCode: 950832, BranchName: 'Summit Surgical Colorado (F32)' },
        { CustCode: 950639, BranchName: 'Western Ohio Columbus (F22)' },
    ];

    // Make mark disable
    isEnabled = true;

    // check If data is null
    isDataAvaialable: boolean = false;

    displayedColumns: string[] = [
        'stop',
        'type',
        'companyDetails',
        'miles',
        'time',
        'select',
    ];

    displayedColumns2: string[] = [
        'Driver',
        'TotalDeliveryTime',
        'TotalDistanceTravelled',
        'TotalServiceTime',
        'TotalTravelTime',
    ];

    dataSource: any = [];
    dataSource2: any = [];

    panelOpenState = false;

    // Define the reactive froms
    reactiveForm!: FormGroup;
    errorMessage = '';

    // Make the user location
    markerLocation: Array<any> = [];

    // Waypoints to show the details
    Waypoints: Array<any> = [];

    // Array of the marks
    makerArray: any = [];

    // Create pollylines
    waypointArray: Array<any> = [];

    // Mat checked array
    isChecked: any = [];

    // Create the polylines
    vertices: google.maps.LatLngLiteral[] = [];

    // Change the value and put the value
    inputCustCode: any;

    // Load google api
    apiLoaded!: Boolean;

    // Subscribers
    subscription: Subscription;

    country = 'USA';

    // Element Refrence of the google map
    @ViewChild('myGoogleMap', { static: false })
    maps!: GoogleMap;

    zoom = 10;

    // Show the center of the google locantion
    center: google.maps.LatLngLiteral = { lat: 23.030847, lng: 72.563625 };

    @ViewChild(MatTable) table!: MatTable<any>;
    // Google map option
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        mapTypeId: 'roadmap' as unknown as google.maps.MapTypeId,
    };

    // Change the color of the routes
    polyLinesOptions!: google.maps.PolylineOptions;

    // Count number of markers
    markers = [] as any;
    numOfDriver = [] as any;

    stopDetailsArray: any = [];

    // dataSourceArray
    dataSourceArray: any = [];

    //Dynamic routeDetails
    routeDetails: any;

    // Different driver markers pin
    driverMarkers = [
        '../../../assets/images/yellopin.png',
        '../../../assets/images/driver2.png',
        '../../../assets/images/pinkpin.png',
        '../../../assets/images/bluepin.png',
    ];

    // Add the checked data
    checkedData: any = [];
    saveLocalData: any = [];
    constructor(
        private fb: FormBuilder,
        private commonSerivice: CommonService,
        public dialog: MatDialog,
        private dynamicService: DynamicRouteService,
        private changeDetector: ChangeDetectorRef,
        private location: Location
    ) {
        // Subscribe to google map observable
        this.subscription = this.commonSerivice.currentApiStatus.subscribe(
            (value) => {
                if (value) {
                    this.apiLoaded = value;
                }
            }
        );
        if (this.apiLoaded) {
            // Navigate the google map
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = {
                    lat: 23.030847,
                    lng: 72.5636256,
                };
            });
            setTimeout(() => {
                this.center = {
                    lat: 23.030847,
                    lng: 72.5636256,
                };
            }, 3000);
        }
    }

    // Reset the screen
    ResetButton() {
        let userReq = {
            startDateTime: moment(
                this.reactiveForm.get('dateControl')?.value
            ).format('YYYY-MM-DD'),
            CustCode: this.reactiveForm.get('accountNo')?.value,
            MarketName: this.reactiveForm.get('marketPlace')?.value,
        };

        this.dynamicService
            .ResetData(userReq)
            .subscribe(async (successData: any) => {
                window.location.reload();
            });
    }

    // Fucntion to update the center of the map
    updateCenter() {
        this.center = {
            lat: 23.030847,
            lng: 72.5636256,
        };
        this.changeDetector.detectChanges();
    }

    // Setting the filter function to change the value
    placeChanges(data: any) {
        this.marketPlace.filter((value: any) => {
            if (data === value.BranchName) {
                this.reactiveForm.patchValue({
                    accountNo: value.CustCode,
                });
            }
        });
    }

    // On component initialization
    ngOnInit(): void {
        this.reactiveForm = this.fb.group({
            accountNo: [this.marketPlace[0].CustCode],
            marketPlace: [this.marketPlace[0].BranchName],
            NoOfDriver: ['', Validators.required],
            dateControl: ['', Validators.required],
        });
        this.updateCenter();
    }

    // Modyfing data on the select data
    selectedData() {}

    // Set the mat-table datasource after response
    setData(data: any) {
        // to put the number of driver in input
        this.numOfDriver = [];
        this.numOfDriver = data.map((ele: any, i: number) => {
            return i;
        });

        // Add the response add stop
        this.stopDetailsArray = [];
        data.forEach((dataEle: any, index: number) => {
            let customerCodeArray = dataEle.map((ele: any, inde2: number) => {
                if (this.saveLocalData.length >= 1) {
                    if (this.saveLocalData[index][inde2] == ele.CustomerCode) {
                        ele.completedStops = this.saveLocalData[index][inde2];
                    }
                }

                return ele.CustomerCode;
            });
            this.stopDetailsArray.push(customerCodeArray);
        });

        this.dataSource = [];

        if (data) {
            this.country = data[0][0].Country;
            this.dataSource = data;
        }
    }

    // Set second data source
    setDataSource2(data: any) {
        this.dataSource2 = [];
        data.OptimizeRoutes.forEach((val: any, ind: number) => {
            let driverData = {
                driver: ind,
                TotalDeliveryTime: data.TotalDeliveryTime[ind],
                TotalDistanceTravelled: data.TotalDistanceTravelled[ind],
                TotalServiceTime: data.TotalServiceTime[ind],
                TotalTravelTime: data.TotalTravelTime[ind],
            };
            this.dataSource2.push(driverData);
        });
    }

    // Set current location from backend response
    getCurrentLocation(data: any) {
        let locationArray = data[0][0].split(',');

        let latValue = parseFloat(locationArray[0]);
        let lngValue = parseFloat(locationArray[1]);
        this.changeDetector.detectChanges();
        this.center = {
            lat: latValue,
            lng: lngValue,
        };
        this.changeDetector.detectChanges();
        this.zoom = 12;
    }

    // This will make the markers over the map
    async createUserRouting(): Promise<void> {
        this.markerLocation.forEach((marker: any, index: number) => {
            // set marker location
            marker.forEach((ele: any, i: number) => {
                if (this.dataSource) {
                    let stopMark: any = [];

                    let value = ele.split(',');

                    // console.log(value);
                    this.dataSource[index].map((data: any, i1: number) => {
                        let lat = data.Latitude;
                        lat = lat.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];

                        let lng = data.Longitude;
                        lng = lng.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];

                        let lat1 = value[0];
                        lat1 = lat1.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];

                        let lng1 = value[1];
                        lng1 = lng1.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];

                        if (lat === lat1 || lng === lng1) {
                            stopMark.push(data.CustomerCode);
                        }
                    });

                    let markerLabelObject = {
                        color: '#000',
                        fontSize: '14px',
                        fontWeight: '700',
                        text: `${stopMark.toString()}`,
                    };

                    this.markers.push({
                        position: {
                            lat: Number(value[0]),
                            lng: Number(value[1]),
                        },
                        label: markerLabelObject,
                        title: `${
                            'Driver Location' + ' ' + stopMark.toString()
                        }`,
                        info: 'Driver Location' + ' ' + stopMark.toString(),
                        icon:
                            i === 0
                                ? '../../../assets/images/greenpin.png'
                                : i === marker.length - 1
                                ? '../../../assets/images/redpin.png'
                                : this.driverMarkers[index],
                        options: {
                            animation: google.maps.Animation.DROP,
                        },
                    });
                }
            });
        });

        this.createWayPoints();
    }

    /* Handle form errors in Angular */
    public errorHandling = (control: string, error: string) => {
        return this.reactiveForm.controls[control].hasError(error);
    };

    createWayPoints() {
        this.waypointArray = [];
        for (let wayPoint of this.Waypoints) {
            for (let way of wayPoint) {
                way.map((ele: any, i: number) => {
                    let wayPoint = ele.split(',');
                    this.waypointArray.push({
                        lat: Number(wayPoint[0]),
                        lng: Number(wayPoint[1]),
                    });
                });
            }
        }
        if (this.waypointArray.length > 0) {
            this.vertices = [];
            this.vertices = this.waypointArray;
        }
    }

    selectedCode(event: any, data: any, driver: number) {
        if (event.checked) {
            this.sendEmptyArray = false;
            this.checkedData[driver].push(data.CustomerCode);
        } else if (!event.checked) {
            this.sendEmptyArray = true;
            this.checkedData[driver].splice(
                this.checkedData[driver].length - 1,
                1
            );
        }
    }

    // Get json data 1
    async getJsonvData() {
        if (this.reactiveForm.valid) {
            if (
                this.checkedData.length !=
                this.reactiveForm.get('NoOfDriver')?.value
            ) {
                for (
                    let i = 0;
                    i < this.reactiveForm.get('NoOfDriver')?.value;
                    i++
                ) {
                    this.checkedData.push([0]);
                }
            }

            if (this.checkedData) this.saveLocalData = this.checkedData;

            console.log(
                'Start time of API call',
                moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            );

            let userReq = {
                startDateTime: moment(
                    this.reactiveForm.get('dateControl')?.value
                ).format('YYYY-MM-DD'),
                CustCode: this.reactiveForm.get('accountNo')?.value,
                MarketName: this.reactiveForm.get('marketPlace')?.value,
                NoOfDriver: this.reactiveForm.get('NoOfDriver')?.value,
                CompletedPoints: this.checkedData,
            };

            this.dynamicService.getRouteDetails(userReq).subscribe(
                async (successData: any) => {
                    console.log(
                        'End time of API call',
                        moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    );

                    if (successData) {
                        console.log(
                            'Start time of Rendering UI',
                            moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        );

                        // save API resposne
                        this.routeDetails = successData;

                        successData.lastdatetime = moment(
                            successData.lastdatetime
                        ).format('YYYY-MM-DD HH:mm:ss');

                        if (!successData?.optimizeroute) {
                            this.isDataAvaialable = true;
                        } else {
                            this.isDataAvaialable = false;

                            // Enable the check-mark
                            this.isEnabled = false;

                            // First grid Data
                            this.setData(
                                successData?.optimizeroute?.OptimizeRoutes
                            );

                            // Second Grid data
                            this.setDataSource2(successData?.optimizeroute);

                            // Marker array
                            this.markerLocation = [];

                            // Create routing
                            this.Waypoints = [];

                            // Array of the marks
                            this.makerArray = [];

                            //  Define the markers location
                            this.markerLocation =
                                successData?.optimizeroute?.MarkerLocation;

                            // Define the waypoint location
                            this.Waypoints =
                                successData?.optimizeroute?.Waypoints;

                            // Redirect to the center of location
                            this.getCurrentLocation(
                                successData?.optimizeroute?.MarkerLocation
                            );

                            // Create routes
                            if (this.Waypoints && this.markerLocation) {
                                this.markers = [];

                                this.createUserRouting();
                            }

                            console.log(
                                'End time of Rendering UI',
                                moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                            );
                        }
                    }
                },
                (error: Error) => {
                    console.log(error);
                }
            );
        }
    }

    // Destroy component and unsubscribe the service
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // this.subscription.unsubscribe();
    }
}
