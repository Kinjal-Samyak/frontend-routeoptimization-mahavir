import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamicRouteService } from 'src/app/shared/services/dynamic-route.service';
import exportFromJSON from 'export-from-json';
@Component({
    selector: 'app-dynamic-route-id',
    templateUrl: './dynamic-route-id.component.html',
    styleUrls: ['./dynamic-route-id.component.scss'],
})
export class DynamicRouteIdComponent implements OnInit {
    sendEmptyArray: boolean = true;

    // Make mark disable
    isEnabled = true;

    // check If data is null
    isDataAvaialable: boolean = false;

    displayedColumns: string[] = [
        'ConnectStop',
        'suggestedStop',
        'Jobs',
        'type',
        'companyDetails',
        'Address',
    ];

    displayedColumns2: string[] = [
        'Jobs#',
        'SuggestedPickupStopNumber',
        'SuggestedPickupDeliveryNumber',
        'PickupCompany',
        'PickupAddress',
        'DeliveryCompany',
        'DeliveryAddress',
    ];

    // Driver lists for get route details
    driverList: any = [];

    // Create table data
    dataSource: any = [];
    dataSource2: any = [];

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

    // Load google api
    apiLoaded!: Boolean;

    // Subscribers
    subscription: Subscription[] = [];

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

    // Check and modify ui based ontime window
    isTimeWindow = false;

    // dataSourceArray
    dataSourceArray: any = [];

    //Dynamic routeDetails
    routeDetails: any;

    // Manage the collapse table
    panelOpenState = false;

    // Different driver markers pin
    driverMarkers = [
        '../../../assets/images/yellopin.png',
        '../../../assets/images/driver2.png',
        '../../../assets/images/pinkpin.png',
        '../../../assets/images/bluepin.png',
    ];

    // Add the checked data
    checkedData: any = [];
    withTimeWindow: boolean = false;

    constructor(
        private fb: FormBuilder,
        private commonSerivice: CommonService,
        public dialog: MatDialog,
        private dynamicService: DynamicRouteService,
        private changeDetector: ChangeDetectorRef
    ) {
        // Subscribe to google map observable
        this.subscription.push(
            this.commonSerivice.currentApiStatus.subscribe((value) => {
                if (value) {
                    this.apiLoaded = value;
                }
            })
        );
        if (this.apiLoaded) {
            // Navigate the google map
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = {
                    lat: 38.563461,
                    lng: -76.085251,
                };
            });
            setTimeout(() => {
                this.center = {
                    lat: 38.563461,
                    lng: -76.085251,
                };
            }, 3000);
        }
    }

    // Reset the screen
    ResetButton() {
        this.reactiveForm.reset();
        this.dataSource = [];
        this.numOfDriver = [];
        this.makerArray = null;
        this.waypointArray = [];
        this.markerLocation = [];
        this.Waypoints = [];
        this.markers = [];
        this.vertices = [];
        this.isChecked = [];
        this.isEnabled = true;
        this.dataSourceArray = [];
        this.dataSource2 = [];
    }

    selectedValue(value: any) {
        if (value === 'WTW') {
            this.withTimeWindow = true;
        } else {
            this.withTimeWindow = false;
        }
    }

    // Fucntion to update the center of the map
    updateCenter() {
        this.center = {
            lat: 38.563461,
            lng: -76.085251,
        };
        this.changeDetector.detectChanges();
    }

    // On component initialization
    ngOnInit(): void {
        this.reactiveForm = this.fb.group({
            accountNo: [''],
            driverList: [''],
        });
        this.updateCenter();
        this.getAllDriver();
    }

    // Get all driver list from backend
    getAllDriver() {
        this.subscription.push(
            this.dynamicService
                .getDriverList()
                .subscribe(async (successData: any) => {
                    this.driverList = successData;
                })
        );
    }

    setGoogleMap(dataOrIndex: any) {
        console.log(dataOrIndex);
        if (dataOrIndex?.optimizeroute) {
            this.markerLocation = [];

            // Create routing
            this.Waypoints = [];

            // Array of the marks
            this.makerArray = [];

            //  Define the markers location
            this.markerLocation = [
                dataOrIndex?.optimizeroute?.MarkerLocation[0],
            ];
            console.log(this.markerLocation);
            // Define the waypoint location
            this.Waypoints = [dataOrIndex?.optimizeroute?.Waypoints[0]];

            // Redirect to the center of location
            this.getCurrentLocation([
                dataOrIndex?.optimizeroute?.MarkerLocation[0],
            ]);

            // Create routes
            if (this.Waypoints && this.markerLocation) {
                this.markers = [];

                this.createUserRouting();
            }
        } else {
            this.markerLocation = [];

            // Create routing
            this.Waypoints = [];

            // Array of the marks
            this.makerArray = [];

            //  Define the markers location
            this.markerLocation = [
                this.routeDetails?.optimizeroute?.MarkerLocation[dataOrIndex],
            ];
            console.log(this.markerLocation);

            // Define the waypoint location
            this.Waypoints = [
                this.routeDetails?.optimizeroute?.Waypoints[dataOrIndex],
            ];

            // Redirect to the center of location
            this.getCurrentLocation([
                this.routeDetails?.optimizeroute?.MarkerLocation[dataOrIndex],
            ]);

            // Create routes
            if (this.Waypoints && this.markerLocation) {
                this.markers = [];

                this.createUserRouting();
            }
        }
    }

    // Set the mat-table datasource after response
    setData(dataSrc: any) {
        // to put the number of driver in input
        this.numOfDriver = [];
        this.numOfDriver = dataSrc.map((ele: any, i: number) => {
            return i;
        });

        this.dataSource = [];

        if (dataSrc) {
            // this.country = dataSrc[0][0].Country;
            this.dataSource = dataSrc;
        }
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
    createUserRouting() {
        this.markerLocation.forEach((marker: any, index: number) => {
            // set marker location
            marker.forEach((ele: any, i: number) => {
                if (this.dataSource) {
                    let stopMark: any = [];

                    let value = ele.split(',');

                    marker.filter((ele2: any, i2: number) => {
                        if (ele === ele2) {
                            stopMark.push(i2 + 1);
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
                        info: `${
                            'Driver Location' + ' ' + stopMark.toString()
                        }`,
                        icon: this.driverMarkers[4],
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

    selectedCode(event: any, e: any, driver: number, index: number) {
        if (event.checked) {
            this.sendEmptyArray = false;
            this.checkedData[driver].push(e.CustomerCode);
        } else if (!event.checked) {
            this.sendEmptyArray = true;
            this.checkedData[driver].splice(
                this.checkedData[driver].length - 1,
                1
            );
        }
    }

    // Get optimizations details using ID
    getJsonvData() {
        if (
            this.reactiveForm.get('accountNo')?.value != '' ||
            this.reactiveForm.get('driverList')?.value != ''
        ) {
            // Cerate api request
            let userReq: any = {};

            let createDriverArr: any = [];
            if (
                this.reactiveForm.get('driverList')?.value &&
                this.reactiveForm.get('accountNo')?.value
            ) {
                let driverId = this.reactiveForm.get('driverList')?.value;

                this.driverList.map((ele: any, i: number) => {
                    let value = this.driverList[i].id;
                    if (driverId.includes(value)) {
                        createDriverArr.push({
                            DriverIds: ele.id,
                            DriverNames: ele.name,
                        });
                    }
                });
                userReq = {
                    RouteOperationId: this.reactiveForm.get('accountNo')?.value,
                    NoOfDriver: createDriverArr.length,
                    RequestType:
                        this.withTimeWindow === true
                            ? 'WithTimeWindow'
                            : 'WithoutTimeWindow',
                    Drivers: createDriverArr,
                };
            } else if (this.reactiveForm.get('accountNo')?.value) {
                userReq = {
                    RouteOperationId: this.reactiveForm.get('accountNo')?.value,
                    RequestType:
                        this.withTimeWindow === true
                            ? 'WithTimeWindow'
                            : 'WithoutTimeWindow',
                    NoOfDriver: 1,
                };
            }

            this.subscription.push(
                this.dynamicService.getOptimizedRouteDetails(userReq).subscribe(
                    (successData: any) => {
                        if (successData) {
                            // Bind data based on request type
                            if (userReq.Drivers) {
                                if (!successData?.optimizeroute) {
                                    this.isDataAvaialable = true;
                                } else {
                                    this.isTimeWindow = true;

                                    this.isDataAvaialable = false;

                                    // save API resposne
                                    this.routeDetails = successData;

                                    // First grid Data
                                    this.setData(
                                        successData?.optimizeroute
                                            .OptimizeRoutes
                                    );

                                    // Second grid Data
                                    this.setData2(successData?.ShipmentDetails);

                                    this.setGoogleMap(successData);
                                }
                            } else {
                                if (!successData?.optimizeroute) {
                                    this.isDataAvaialable = true;
                                } else {
                                    this.isDataAvaialable = false;
                                    this.isTimeWindow = false;
                                    // save API resposne
                                    this.routeDetails = successData;

                                    // First grid Data
                                    this.setData(
                                        successData?.optimizeroute
                                            .OptimizeRoutes
                                    );

                                    // Second grid Data
                                    this.setData2(successData?.ShipmentDetails);

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
                                        successData?.optimizeroute
                                            ?.MarkerLocation
                                    );

                                    // Create routes
                                    if (this.Waypoints && this.markerLocation) {
                                        this.markers = [];

                                        this.createUserRouting();
                                    }
                                }
                            }
                        }
                    },
                    (error: any) => {}
                )
            );
        }
    }

    // Bind the shipment details of second grid
    setData2(tableData: any) {
        if (tableData) {
            this.dataSource2 = [];
            // Setting up data for 2nd grid when we get shipment details from With TimeWindow
            if (this.dataSource.length > 1) {
                const driverArrays: any = {};

                for (let i = 0; i < tableData.length; i++) {
                    const shipment = tableData[i];
                    const driverName = shipment.DriverName;

                    if (!driverArrays[driverName]) {
                        driverArrays[driverName] = [];
                    }

                    driverArrays[driverName].push(shipment);
                }

                const arrayOfArrays = Object.values(driverArrays);
                this.dataSource2 = arrayOfArrays;
            } else {
                // Setting up data for 2nd grid when we get shipment details from Without TimeWindow
                this.dataSource2 = [tableData];
            }
        }
    }

    // Destroy component and unsubscribe the service
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscription.forEach((value) => value.unsubscribe());
    }
}
