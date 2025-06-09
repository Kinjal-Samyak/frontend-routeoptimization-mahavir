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
import { map, Subscription } from 'rxjs';
import { AddStopComponent } from 'src/app/shared/component/add-stop/add-stop.component';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamicRouteService } from 'src/app/shared/services/dynamic-route.service';
import { ThemePalette } from '@angular/material/core';
import exportFromJSON from 'export-from-json';
@Component({
    selector: 'app-dynamic-route-map',
    templateUrl: './dynamic-route-map.component.html',
    styleUrls: ['./dynamic-route-map.component.scss'],
})
export class DynamicRouteMapComponent implements OnInit {
    // -----------------Mat date picker------------------------

    @ViewChild('picker') picker: any;
    date!: moment.Moment;
    disabled = false;
    showSpinners = true;
    showSeconds = true;
    touchUi = true;
    enableMeridian = false;
    minDate!: moment.Moment;
    maxDate: any;
    stepHour = 1;
    stepMinute = 1;
    stepSecond = 1;
    disableMinute = false;
    hideTime = false;
    color: ThemePalette = 'primary';

    // --------------------------------------------------------

    selectedOption: string = '2';

    // -----------------Market Places -------------------------
    marketPlace: any = [
        { Custcode: '950671', BranchName: 'ANC East Hartford (F01)' },
        { Custcode: '950641', BranchName: 'Austin Hub' },
        { Custcode: '950589', BranchName: 'Houston Metro (F52)' },
        { Custcode: '950664', BranchName: 'Los Angeles (F44)' },
        { Custcode: '950679', BranchName: 'Mid Atlantic Hanover (F11)' },
        { Custcode: '950652', BranchName: 'New York Metro (F05)' },
        { Custcode: '950683', BranchName: 'North Texas (F25)' },
        {
            Custcode: '950693',
            BranchName: 'Northern California Sacramento (F34)',
        },
        { Custcode: '950685', BranchName: 'Oklahoma OKC (F27)' },
        { Custcode: '950631', BranchName: 'South Texas Austin (F24)' },
        { Custcode: '950640', BranchName: 'South Texas El Paso (F24)' },
        { Custcode: '950641', BranchName: 'South Texas San Antonio (F24)' },
        {
            Custcode: '950643',
            BranchName: 'Southern California Anaheim (F37)',
        },
        {
            Custcode: '950698',
            BranchName: 'Steel Mountain Brecksville (F08)',
        },
        { Custcode: '950669', BranchName: 'Summit Surgical Colorado (F32)' },
        { Custcode: '950662', BranchName: 'Western Ohio Columbus (F22)' },
    ];

    // --------------------------------------------------------

    // Make mark disable
    isEnabled = true;

    // input field for validations
    email = new FormControl('1', [Validators.required]);
    addStopUpload = new FormControl('');
    getErrorMessage() {
        return this.email.hasError('required')
            ? 'Enter a value'
            : this.email.hasError('email')
            ? 'Not valid'
            : '';
    }

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
        'select',
    ];
    dataSource: any = [];
    dataSource2: any = [];

    panelOpenState = false;

    // Define the reactive froms
    reactiveForm!: FormGroup;
    errorMessage = '';

    // Make the user location
    markerLocation: Array<any> = [];

    Waypoints: Array<any> = [];

    // Array of the marks
    makerArray: any = [];

    waypointArray: Array<any> = [];

    // Define the stop details
    stopDetailsObj!: any;

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

    // Different driver markers pin
    driverMarkers = [
        '../../../assets/images/yellopin.png',
        '../../../assets/images/driver2.png',
        '../../../assets/images/pinkpin.png',
        '../../../assets/images/bluepin.png',
    ];

    // Add the checked data
    checkedData: any = [];
    constructor(
        private fb: FormBuilder,
        private commonSerivice: CommonService,
        public dialog: MatDialog,
        private dynamicService: DynamicRouteService,
        private changeDetector: ChangeDetectorRef
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
                    accountNo: value.Custcode,
                });
            }
        });
    }

    // On component initialization
    ngOnInit(): void {
        this.reactiveForm = this.fb.group({
            fileUpload: [''],
            accountNo: [this.marketPlace[0].Custcode],
            marketPlace: [this.marketPlace[0].BranchName],
            dateControl: [''],
            dateControl1: [''],
        });
        this.updateCenter();
    }

    // Modyfing data on the select data
    selectedData(event: any, data: any, index: number) {
        if (event.checked) {
            if (this.stopDetailsObj.CompletedPoints.length > 0) {
                let elementExists = this.stopDetailsObj.CompletedPoints.some(
                    (value: any) => {
                        if (data === value) return true;
                        else return false;
                    }
                );

                if (!elementExists) {
                    this.stopDetailsObj.CompletedPoints.push(data);
                }
            } else if (this.stopDetailsObj.CompletedPoints.length == 0) {
                this.stopDetailsObj.CompletedPoints.push(data);
            }
        } else if (!event.checked) {
            this.stopDetailsObj.CompletedPoints.splice(index, 1);
        }
    }

    // Read file after the file upload
    onChange(e: any) {
        this.stopDetailsObj = [];

        let reader: any = new FileReader();
        reader.onload = (event: any) => {
            this.stopDetailsObj = JSON.parse(event.target.result);
            this.setDataSource(this.stopDetailsObj);
        };
        reader.readAsText(e.target.files[0]);
    }

    // Set data source to mat-table when there is no API calling
    setDataSource(data: any) {
        this.dataSource = [];
        this.numOfDriver = [];
        this.numOfDriver = [1];
        if (data) {
            this.email.setValue(data.VehicleId.length);
            this.email.setValue(data.VehicleId.length);
            this.dataSource.push(data.CustomerDetailsForRoute);
        }
    }

    // Set the mat-table datasource after response
    setData(data: any) {
        // Add the response add stop
        this.stopDetailsArray = [];
        data.forEach((dataEle: any, index: number) => {
            let customerCodeArray = dataEle.map((ele: any) => {
                return ele.CustomerCode;
            });
            this.stopDetailsArray.push(customerCodeArray);
        });
        console.log(this.stopDetailsArray);

        // to put the number of driver in input
        this.numOfDriver = [];
        this.numOfDriver = data.map((ele: any, i: number) => {
            return i;
        });
        this.dataSource = [];

        if (data) {
            this.country = data[0][0].Country;
            this.dataSource = data;
        }
    }

    // Submit the response
    onSubmit() {
        if (this.selectedOption === '2') {
            const object = JSON.stringify(this.stopDetailsObj);

            this.dynamicService.sendDetails(object).subscribe(
                async (result: any) => {
                    if (result) {
                        console.log('input driver data', result);

                        this.isEnabled = false;

                        this.setData(result.OptimizeRoutes);

                        this.setDataSource2(result);

                        this.markerLocation = [];

                        this.Waypoints = [];

                        // Array of the marks
                        this.makerArray = [];

                        //  Define the markers location
                        this.markerLocation = result?.MarkerLocation;

                        // Define the waypoint location
                        this.Waypoints = result?.Waypoints;

                        this.getCurrentLocation(result?.MarkerLocation);

                        // Create routes
                        if (this.Waypoints && this.markerLocation) {
                            this.markers = [];

                            await this.createUserRouting();
                        }
                    }
                },
                (error: any) => {
                    if (this.selectedOption === '2')
                        this.errorMessage = 'Please select a file.';
                }
            );
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

    // Cancel the form to submit
    cancelForm() {
        this.reactiveForm.reset();
        this.email.reset();
        this.dataSource = [];
        this.stopDetailsObj = null;
        this.stopDetailsArray = [];
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
        this.addStopDetails = [];
    }

    /* Handle form errors in Angular */
    public errorHandling = (control: string, error: string) => {
        return this.reactiveForm.controls[control].hasError(error);
    };

    // Add the stop points
    addStop() {
        const dialogRef = this.dialog.open(AddStopComponent, {
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let pickupObj = {
                    CustomerCode: result.data.stop,
                    CompanyName: result.data.companyName,
                    AddressLine1: result.data.addressLine1,
                    City: result.data.city,
                    State: result.data.state,
                    ZipCode: result.data.zip,
                    Country: result.data.country,
                    Latitude: '0',
                    Longitude: '0',
                    ServiceTime: 0,
                    type: 'P',
                };

                let deliveryObj = {
                    CustomerCode: result.data.stop2,
                    CompanyName: result.data.companyName2,
                    AddressLine1: result.data.addressLine12,
                    City: result.data.city2,
                    State: result.data.state2,
                    ZipCode: result.data.zip2,
                    Country: result.data.country2,
                    Latitude: '0',
                    Longitude: '0',
                    ServiceTime: 0,
                    type: 'D',
                };
                this.stopDetailsObj.VehiclePickDropPoints.push([
                    result.data.stop,
                    result.data.stop2,
                ]);
                this.stopDetailsObj.CustomerDetailsForRoute.push(
                    pickupObj,
                    deliveryObj
                );
                this.dataSource[0].push(pickupObj, deliveryObj);
                console.log(this.dataSource);

                this.table.renderRows();
            }
        });
    }

    async createWayPoints() {
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

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Destroy component and unsubscribe the service
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // this.subscription.unsubscribe();
    }

    // Set the date to 48hours
    dateChanged(e: any) {
        let date = new Date(`${e.value}`);
        date.setUTCHours(date.getHours() + 48);
        this.maxDate = date.toISOString();
    }

    // Get radio button event
    selectedValue(event: any) {
        this.selectedOption = event.value;
    }

    addStopDetails: any;

    // Read file after the file upload
    onFileChange(e: any) {
        console.log(e);
        this.addStopDetails = [];
        let reader: any = new FileReader();
        reader.onload = (event: any) => {
            this.addStopDetails = JSON.parse(event.target.result);
            if (this.addStopDetails) {
                this.addExtraStops(this.addStopDetails);
            }
        };
        reader.readAsText(e.target.files[0]);
    }

    // // Save and proceed the json data
    // setAddStopData(addStopData: any) {
    //     this.addExtraStops(addStopData);
    //     // // Edit the initial json file
    //     // let lastElem =
    //     //     Number(
    //     //         this.stopDetailsObj.CustomerDetailsForRoute[
    //     //             this.stopDetailsObj.CustomerDetailsForRoute.length - 1
    //     //         ].CustomerCode
    //     //     ) + 1;

    //     // const CustomerDetailsForR = addStopData.CustomerDetailsForRoute.map(
    //     //     (value: any, i: number) => {
    //     //         value.CustomerCode = lastElem + i;
    //     //         value.CustomerCode = value.CustomerCode.toString();
    //     //         this.stopDetailsObj.CustomerDetailsForRoute.push(value);
    //     //         return value;
    //     //     }
    //     // );

    //     // let pointElemn = Number(lastElem);

    //     // const VehiclePickDropPoint = addStopData.VehiclePickDropPoints.map(
    //     //     (DropPoints: any, i1: number) => {
    //     //         let pointsArr: any = [];
    //     //         DropPoints.forEach((points: any, i2: number) => {
    //     //             pointElemn = pointElemn + i2;
    //     //             pointsArr.push(`${pointElemn}`);
    //     //         });
    //     //         this.stopDetailsObj.VehiclePickDropPoints.push(pointsArr);
    //     //         pointElemn++;
    //     //         return pointsArr;
    //     //     }
    //     // );

    //     // // Create two json files
    //     // let newAddStopJson = {
    //     //     VehiclePickDropPoints: VehiclePickDropPoint,
    //     //     CustomerDetailsForRoute: CustomerDetailsForR,
    //     // };

    //     // if (newAddStopJson) {

    //     // }
    // }

    // Adding the extra stops
    async addExtraStops(data1: any) {
        if (this.checkedData) data1.VehicleId = this.checkedData;
        console.log(data1);
        const object1 = JSON.stringify(data1);

        this.dynamicService.getExtraStopsDetails(object1).subscribe(
            async (result: any) => {
                if (result) {
                    await this.setData(result.OptimizeRoutes);
                    this.setDataSource2(result);
                    this.markerLocation = [];
                    this.checkedData = [];
                    this.Waypoints = [];

                    // Array of the marks
                    this.makerArray = [];

                    //  Define the markers location
                    this.markerLocation = result?.MarkerLocation;

                    // Define the waypoint location
                    this.Waypoints = result?.Waypoints;

                    await this.getCurrentLocation(result?.MarkerLocation);

                    // Create routes
                    if (this.Waypoints && this.markerLocation) {
                        this.markers = [];

                        await this.createUserRouting();
                    }
                }
            },
            (error: any) => {}
        );
    }

    // End date changed events
    toDateChanged(e: any) {
        console.log(
            moment(this.reactiveForm.get('dateControl')?.value).format(
                'MM/DD/YYYY, HH:mm'
            )
        );

        console.log(
            moment(this.reactiveForm.get('dateControl1')?.value).format(
                'MM/DD/YYYY, HH:mm'
            )
        );
    }

    saveInitialJson1: any;

    // Get json data 1
    async getJsonvData1() {
        let userReq = {
            startDateTime: moment(
                this.reactiveForm.get('dateControl')?.value
            ).format('MM/DD/YYYY, HH:mm'),
            endDateTime: moment(
                this.reactiveForm.get('dateControl1')?.value
            ).format('MM/DD/YYYY, HH:mm'),
            CustCode: this.reactiveForm.get('accountNo')?.value,
            MarketName: this.reactiveForm.get('marketPlace')?.value,
        };

        this.dynamicService.getRouteDetails(userReq).subscribe(
            (successData: any) => {
                if (successData) {
                    this.saveInitialJson1 = successData;
                    const data = successData;
                    const fileName =
                        'input_driver_' +
                        `${moment(new Date()).format('MM/DD/YYYY_HH:mm')}`;
                    const exportType = 'json';

                    exportFromJSON({ data, fileName, exportType });
                }
            },
            (error: any) => {}
        );
    }

    // Get json data 2
    async getJsonvData2() {
        let userReq = {
            startDateTime: moment(
                this.reactiveForm.get('dateControl')?.value
            ).format('MM/DD/YYYY, HH:mm'),
            endDateTime: moment(
                this.reactiveForm.get('dateControl1')?.value
            ).format('MM/DD/YYYY, HH:mm'),
            CustCode: this.reactiveForm.get('accountNo')?.value,
            MarketName: this.reactiveForm.get('marketPlace')?.value,
        };

        this.dynamicService.getJson2FileDetails(userReq).subscribe(
            (successData: any) => {
                if (
                    successData.CustomerDetailsForRoute &&
                    successData.VehiclePickDropPoints
                ) {
                    // Edit the initial json file
                    let lastElem =
                        Number(
                            this.saveInitialJson1.CustomerDetailsForRoute[
                                this.saveInitialJson1.CustomerDetailsForRoute
                                    .length - 1
                            ].CustomerCode
                        ) + 1;

                    const CustomerDetailsForR =
                        successData.CustomerDetailsForRoute.map(
                            (value: any, i: number) => {
                                value.CustomerCode = lastElem + i;
                                value.CustomerCode =
                                    value.CustomerCode.toString();
                                this.saveInitialJson1.CustomerDetailsForRoute.push(
                                    value
                                );
                                return value;
                            }
                        );

                    let pointElemn = Number(lastElem);

                    const VehiclePickDropPoint =
                        successData.VehiclePickDropPoints.map(
                            (DropPoints: any, i1: number) => {
                                let pointsArr: any = [];
                                DropPoints.forEach(
                                    (points: any, i2: number) => {
                                        pointElemn = pointElemn + i2;
                                        pointsArr.push(`${pointElemn}`);
                                    }
                                );
                                this.saveInitialJson1.VehiclePickDropPoints.push(
                                    pointsArr
                                );
                                pointElemn++;
                                return pointsArr;
                            }
                        );

                    // Create two json files
                    let newAddStopJson = {
                        VehiclePickDropPoints: VehiclePickDropPoint,
                        CustomerDetailsForRoute: CustomerDetailsForR,
                    };

                    const data = newAddStopJson;
                    const fileName =
                        'Add_Stop_data_' +
                        `${moment(
                            this.reactiveForm.get('dateControl')?.value
                        ).format('HH:mm')}` +
                        `${this.reactiveForm.get('marketPlace')?.value}` +
                        `${moment(
                            this.reactiveForm.get('dateControl1')?.value
                        ).format('HH:mm')}`;
                    const exportType = 'json';

                    exportFromJSON({ data, fileName, exportType });
                } else if (successData) {
                    const data = successData;
                    const fileName =
                        'Add_Stop_data_' +
                        `${moment(
                            this.reactiveForm.get('dateControl')?.value
                        ).format('HH:mm')}` +
                        `${this.reactiveForm.get('marketPlace')?.value}` +
                        `${moment(
                            this.reactiveForm.get('dateControl1')?.value
                        ).format('HH:mm')}`;
                    const exportType = 'json';

                    exportFromJSON({ data, fileName, exportType });
                }
            },
            (error: any) => {}
        );
    }

    // Get All json data on click
    getAllJsonData() {
        let userReq = {
            startDateTime: moment(
                this.reactiveForm.get('dateControl')?.value
            ).format('MM/DD/YYYY, HH:mm'),
            endDateTime: moment(
                this.reactiveForm.get('dateControl1')?.value
            ).format('MM/DD/YYYY, HH:mm'),
            CustCode: this.reactiveForm.get('accountNo')?.value,
            MarketName: this.reactiveForm.get('marketPlace')?.value,
        };

        this.dynamicService.getJson2FileDetails(userReq).subscribe(
            (successData: any) => {
                if (
                    successData.CustomerDetailsForRoute &&
                    successData.VehiclePickDropPoints
                ) {
                    // Edit the initial json file
                    let lastElem =
                        Number(
                            this.saveInitialJson1.CustomerDetailsForRoute[
                                this.saveInitialJson1.CustomerDetailsForRoute
                                    .length - 1
                            ].CustomerCode
                        ) + 1;

                    const CustomerDetailsForR =
                        successData.CustomerDetailsForRoute.map(
                            (value: any, i: number) => {
                                value.CustomerCode = lastElem + i;
                                value.CustomerCode =
                                    value.CustomerCode.toString();
                                this.saveInitialJson1.CustomerDetailsForRoute.push(
                                    value
                                );
                                return value;
                            }
                        );

                    let pointElemn = Number(lastElem);

                    const VehiclePickDropPoint =
                        successData.VehiclePickDropPoints.map(
                            (DropPoints: any, i1: number) => {
                                let pointsArr: any = [];
                                DropPoints.forEach(
                                    (points: any, i2: number) => {
                                        pointElemn = pointElemn + i2;
                                        pointsArr.push(`${pointElemn}`);
                                    }
                                );
                                this.saveInitialJson1.VehiclePickDropPoints.push(
                                    pointsArr
                                );
                                pointElemn++;
                                return pointsArr;
                            }
                        );

                    // Create two json files
                    let newAddStopJson = {
                        VehiclePickDropPoints: VehiclePickDropPoint,
                        CustomerDetailsForRoute: CustomerDetailsForR,
                    };

                    const data = newAddStopJson;
                    const fileName =
                        'Add_Stop_data_' +
                        `${moment(
                            this.reactiveForm.get('dateControl')?.value
                        ).format('HH:mm')}` +
                        `${this.reactiveForm.get('marketPlace')?.value}` +
                        `${moment(
                            this.reactiveForm.get('dateControl1')?.value
                        ).format('HH:mm')}`;
                    const exportType = 'json';

                    exportFromJSON({ data, fileName, exportType });

                    this.getAllJson();
                } else if (successData) {
                    const data = successData;
                    const fileName =
                        'Add_Stop_data_' +
                        `${moment(
                            this.reactiveForm.get('dateControl')?.value
                        ).format('HH:mm')}` +
                        `${this.reactiveForm.get('marketPlace')?.value}` +
                        `${moment(
                            this.reactiveForm.get('dateControl1')?.value
                        ).format('HH:mm')}`;
                    const exportType = 'json';

                    exportFromJSON({ data, fileName, exportType });
                    this.getAllJson();
                }
            },
            (error: any) => {}
        );
    }

    // Call API after every 15 minutes
    getAllJson() {
        let formDate = new Date(
            `${this.reactiveForm.get('dateControl')?.value}`
        );
        let toDate = new Date(
            `${this.reactiveForm.get('dateControl1')?.value}`
        );

        formDate = new Date(formDate.getTime() + 15 * 60 * 1000);
        toDate = new Date(toDate.getTime() + 15 * 60 * 1000);

        let endDateTime = new Date(
            toDate.getFullYear(),
            toDate.getMonth(),
            toDate.getDate(),
            22,
            59,
            59,
            999
        );

        this.reactiveForm.patchValue({
            dateControl: formDate.toISOString(),
            dateControl1: toDate.toISOString(),
        });

        if (formDate && toDate) {
            if (toDate <= endDateTime) {
                this.getAllJsonData();
            }
        }
    }

    addStopCheck(checked: any) {
        let driverDetails = 'Id' + (checked.driver + 1);
        this.checkedData.push(driverDetails);
    }
}
