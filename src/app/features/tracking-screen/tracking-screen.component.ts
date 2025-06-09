import {
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { AddStopComponent } from 'src/app/shared/component/add-stop/add-stop.component';
import { MatDialog } from '@angular/material/dialog';
import { StopDetailsComponent } from 'src/app/shared/component/stop-details/stop-details.component';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Country } from 'src/app/shared/model/country.model';
import { ConstarintsPopupComponent } from 'src/app/shared/component/constarints-popup/constarints-popup.component';
import { CustomMarkerService } from 'src/app/shared/services/custom-marker.service';
import { constantFunction } from 'src/app/shared/constants/constantFunction.constant';
import { StopService } from 'src/app/shared/services/stop.service';
import { ToastrService } from 'ngx-toastr';
import { LiveTrackingService } from 'src/app/shared/services/live-tracking.service';
import { DatePipe } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-tracking-screen',
    templateUrl: './tracking-screen.component.html',
    styleUrls: ['./tracking-screen.component.scss'],
})
export class TrackingScreenComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion | any;

    // Dropped stops table to show
    displayedColumns = [
        'stopNo',
        'stopName',
        'contactNo',
        'address',
        'stopTime',
        'parkingTime',
    ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // Live tracking time array
    liveTime: any = [];

    // Make the user location
    markerLocation: Array<any> = [];

    // Waypoints to show the details
    Waypoints: Array<any> = [];

    // Array of the marks
    makerArray: any = [];

    // Create pollylines
    waypointArray: Array<any> = [];

    // Data of routes
    routeDetails: any;

    // Hexa colour array
    hexArray: Array<any> = [];

    // driver from control
    driverForm = new FormControl('');

    // Create the polylines
    vertices: google.maps.LatLngLiteral[] = [];

    // Change the color of the routes
    polyLinesOptions!: google.maps.PolylineOptions;

    polylines: any = [];

    filteredOptions: any = new Observable<Country[]>();

    // Different driver markers pin
    driverMarkers = [
        '../../../assets/images/yellopin.png',
        '../../../assets/images/driver2.png',
        '../../../assets/images/pinkpin.png',
        '../../../assets/images/bluepin.png',
    ];
    markers: any;

    // Storing time of start and end of live tracking
    timeIntervals: any[] = [];

    // Custom configurations for the add stop pop-up
    displayFilter: boolean = false;
    currentFolder: string = '';
    isEdit: boolean = false;

    // Pop-up form data
    stopForm!: FormGroup;

    countryList: { name: string; countryId: string }[];
    routeIdArray: any = [];
    timeSlots: any = [];

    // hostlistner to close filter
    @HostListener('click', ['$event'])
    outSideClickFunction(event: any) {
        if (event.target.classList.value === 'row filter-wrapper') {
            this.displayFilter = false;
        }
    }

    // Time slot array
    defaultSelectedslot: any;

    // Select all the check boxes
    allSelected = false;

    // find current date
    currentDate: any;

    driverTimeSlots: any;

    // Select attribute of the mat-select
    @ViewChild('select') select: MatSelect | any;

    // selection of the time slot
    selectedTimeSlot: any;

    // control selections of dropdown
    toggleAllSelection() {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => item.select());
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }

    // Selection of the time slot
    optionClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }

    constructor(
        private commonSerivice: CommonService,
        private changeDetector: ChangeDetectorRef,
        public router: Router,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private stopService: StopService,
        private customMarkerIcon: CustomMarkerService,
        private toastr: ToastrService,
        private liveTracking: LiveTrackingService,
        private datePipe: DatePipe
    ) {
        this.stopForm = this.fb.group(
            {
                name: ['', Validators.required],
                contactNo: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9]*$')],
                ],
                fromTime: ['', Validators.required],
                toTime: ['', Validators.required],
                address: ['', Validators.required],
                city: ['', Validators.required],
                state: ['', Validators.required],
                countryId: ['', Validators.required],
                zipCode: ['', Validators.required],
                remark: [''],
                type: ['', Validators.required],
            },
            { validator: this.checkDates }
        );

        this.countryList = [
            { name: 'Afghanistan', countryId: 'A' },
            { name: 'Australia', countryId: 'B' },
            { name: 'Bangladesh', countryId: 'C' },
            { name: 'Bhutan', countryId: 'D' },
            { name: 'China', countryId: 'E' },
            { name: 'Colombia', countryId: 'F' },
            { name: 'Denmark', countryId: 'G' },
            { name: 'Egypt', countryId: 'H' },
            { name: 'India', countryId: 'IN' },
        ];

        this.filteredOptions = this.stopForm
            .get('countryId')
            ?.valueChanges.pipe(
                startWith(''),
                map((value) => {
                    const name =
                        typeof value === 'string' ? value : value?.name;
                    return name
                        ? this._filter(name as string)
                        : this.countryList.slice();
                })
            );
    }

    // Validator for check dates
    checkDates(stopForm: FormGroup) {
        let fromTime = stopForm?.value.fromTime;
        let toTime = stopForm?.value.toTime;
        if (
            !constantFunction.isEmpty(fromTime) &&
            !constantFunction.isEmpty(toTime)
        ) {
            if (fromTime > toTime) {
                return { notValid: true };
            }
        }

        return null;
    }

    // Manage the collapse table
    panelOpenState = false;
    panels: any = [];
    arrayOfDriverActivity: any;

    // color combination arrays
    arrayOfDarkColor = [
        '#88b5fa',
        '#76c4cb',
        '#fcc6b4',
        '#B4F6FF',
        '#4D93E7',
        '#F6DF6C',
        '#F68FF6',
        '#A46AEE',
        '#288C07',
    ];
    arrayOfColor = [
        '#88b5fa',
        '#76c4cb',
        '#fcc6b4',
        '#B4F6FF',
        '#4D93E7',
        '#F6DF6C',
        '#F68FF6',
        '#A46AEE',
        '#288C07',
    ];
    lightColorArray = [
        '#EEF5FF',
        '#ECFDFF',
        '#FFEFE7',
        '#F5FEFF',
        '#E7F2FF',
        '#FFFBE7',
        '#FFF2FE',
        '#F8F2FF',
        '#E4FFDB',
    ];
    minLightColorAraay = [
        '#C9DEFF',
        '#C9FBFF',
        '#FFE6D3',
        '#CEF9FF',
        '#CDE4FF',
        '#FAEFB7',
        '#FDD0FD',
        '#DEC1FF',
        '#BAE4AD',
    ];

    // Array of Subscribers
    subscription: Subscription[] = [];

    // Load google api
    apiLoaded!: Boolean;
    // Show the center of the google locantion
    center: google.maps.LatLngLiteral = { lat: 23.030847, lng: 72.563625 };

    // Element Refrence of the google map
    @ViewChild('myGoogleMap', { static: false })
    maps!: GoogleMap;

    markerOptions: google.maps.MarkerOptions = {};

    // Google map option
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        mapTypeId: 'roadmap' as unknown as google.maps.MapTypeId,
    };

    zoom = 10;

    togglePanel(event: Event): void {
        // Toggle the expansion panel programmatically
        const panel = (event.target as HTMLElement).closest(
            '.mat-expansion-panel'
        );
        if (panel) {
            panel.classList.toggle('mat-expanded');
        }
    }

    // Optionally, you can define the panelClick function to prevent the panel from toggling
    // when clicking on any part of the panel (except for the toggle button).
    panelClick(event: Event): void {
        event.stopPropagation();
    }

    ngOnInit(): void {
        // Subscribe to google map observable
        this.subscription.push(
            this.commonSerivice.currentApiStatus.subscribe((value) => {
                if (value) {
                    this.apiLoaded = value;
                    this.center = {
                        lat: 38.563461,
                        lng: -76.085251,
                    };
                }
            })
        );

        this.subscription.push(
            this.commonSerivice.optimizeRouteDetails.subscribe((value) => {
                if (value) {
                    this.routeDetails = value;
                }
            })
        );

        if (!this.routeDetails) {
            this.router.navigate(['/home/stops']);
            this.commonSerivice.headerTitle.next('Stops (Delivery) Management');
        } else {
            this.setUpTrackingData();
        }
    }

    setUpTrackingData() {
        this.markerLocation = [];
        this.Waypoints = [];
        this.makerArray = [];
        this.panels = [];
        this.dataSource.data = [];
        this.polylines = [];

        this.arrayOfDriverActivity = this.routeDetails?.routes;

        // Getting the current date and using split
        this.currentDate = this.routeDetails?.minTimeWindow.split(' ')[0];

        // Convert maximum start and end times to Date objects
        const startDate: any = new Date(this.routeDetails?.minTimeWindow);
        const endDate: any = new Date(this.routeDetails?.maxTimeWindow);

        this.setTimeSlot(startDate, endDate);

        this.setDriverPanelStops(startDate, endDate);

        this.routeDetails?.routes.filter((val: any) => {
            val.stops.filter((val2: any, index: number) => {
                val2.stopNum = index + 1;
            });
        });

        // Define the route details
        this.panels = this.routeDetails?.routes;

        if (this.routeDetails?.dropStops) {
            this.dataSource = new MatTableDataSource(
                this.routeDetails?.dropStops
            );
            this.dataSource.sort = this.sort;
        }

        // Calculate time intervals
        this.timeIntervals = [];
        const interval = 60 * 60 * 1000; // One hour in milliseconds
        // If the difference between start and end date is less than one hour
        if (endDate - startDate < interval) {
            const formattedStartTime = startDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
            const formattedEndTime = endDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
            this.timeIntervals.push(formattedStartTime);
            // Add the end time directly
            this.timeIntervals.push(formattedEndTime);
        } else {
            // If the difference is greater than or equal to one hour
            for (
                let currentTime = startDate;
                currentTime <= endDate;
                currentTime.setTime(currentTime.getTime() + interval)
            ) {
                const formattedTime = currentTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // Set this to false to ensure 24-hour format
                });
                this.timeIntervals.push(formattedTime);
            }
        }
        this.createRoute();
    }

    // Create time slots
    setTimeSlot(startDate: any, endDate: any) {
        this.timeSlots = [];
        const interval = 60 * 60 * 1000; // 1 hour in milliseconds
        let currentTime = startDate.getTime();

        while (currentTime < endDate.getTime()) {
            const startTime = new Date(currentTime);
            const endTime = new Date(currentTime + interval);

            const timeSlot = `${startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Set this to false to ensure 24-hour format
            })} - ${endTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Set this to false to ensure 24-hour format
            })}`;
            this.timeSlots.push(timeSlot);

            currentTime += interval;
        }
    }

    // Setting up the driver stops details as panel timing
    setDriverPanelStops(startDate: any, endDate: any) {
        // Define the minimum and maximum times
        const minTime = startDate.getTime();
        const maxTime = endDate.getTime();

        this.routeDetails?.routes.filter((value: any) => {
            value.stops.filter((timeData: any) => {
                // Define the estimated visit time
                const estimatedVisitTime = new Date(
                    timeData?.driverEstVisitDatetime
                ).getTime();

                // Calculate the time difference between estimated time and minimum time
                const timeDifference = estimatedVisitTime - minTime;

                // Calculate the total time range
                const totalTimeRange = maxTime - minTime;

                // Calculate the percentage
                let percentage = (timeDifference / totalTimeRange) * 100;

                if (percentage > 100) {
                    percentage = 100;
                } else if (percentage < 0) {
                    percentage = 0;
                }
                timeData.percentage = percentage.toFixed(0) + '%';
            });
        });
    }

    // Select time slots based on selection
    selectTimeSlot() {
        const selectedValue = this.select.value;
        if (selectedValue.length === 0) {
            this.setUpTrackingData();
            return;
        }
        // Get the first item
        let firstItem = selectedValue[0];
        firstItem = firstItem.split(' ')[0];
        // Get the last item
        let lastItem = selectedValue[selectedValue.length - 1];
        lastItem = lastItem.split(' ')[2];

        // Convert maximum start and end times to Date objects
        const startDate = new Date(`${this.currentDate} ${firstItem}`);
        const endDate = new Date(`${this.currentDate} ${lastItem}`);

        this.setDriverPanelStops(startDate, endDate);

        this.panels = this.filterStopsByTimeRange(
            this.routeDetails?.routes,
            startDate,
            endDate
        );

        // Calculate time intervals
        this.timeIntervals = [];
        let interval;

        if (selectedValue.length >= 1 && selectedValue.length <= 3) {
            interval = 15 * 60 * 1000; // 15 minutes in milliseconds
        } else if (selectedValue.length >= 4 && selectedValue.length <= 5) {
            interval = 30 * 60 * 1000; // 30 minutes in milliseconds
        } else {
            interval = 60 * 60 * 1000; // 1 hour in milliseconds
        }

        for (
            let currentTime = startDate;
            currentTime <= endDate;
            currentTime.setTime(currentTime.getTime() + interval)
        ) {
            const formattedTime = currentTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Set this to false to ensure 24-hour format
            });
            this.timeIntervals.push(formattedTime);
        }
    }

    // Filter stops by time range
    filterStopsByTimeRange(routes: any[], startDate: any, endDate: any): any[] {
        const [startTime, endTime] = [startDate.getTime(), endDate.getTime()];

        return routes.map((route) => {
            const filteredStops = route.stops.filter((stop: any) => {
                const estVisitTime = new Date(
                    stop.driverEstVisitDatetime
                ).getTime();
                return estVisitTime >= startTime && estVisitTime <= endTime;
            });

            return { ...route, stops: filteredStops };
        });
    }

    // This will make the markers over the map
    createUserRouting() {
        this.markerOptions = {
            opacity: 1.0,
            animation: google.maps.Animation.DROP,
            optimized: true,
            zIndex: 1,
        };
        this.markerLocation.forEach((marker: any, index: number) => {
            // set marker location
            let cusomIcon = this.customMarkerIcon.setFillColor(
                this.arrayOfColor[index]
            );

            if (marker) {
                marker.forEach((ele: any, i: number) => {
                    let stopMark: any = [];

                    let value = ele.split(',');

                    marker.filter((ele2: any, i2: number) => {
                        if (ele === ele2) {
                            stopMark.push(i2 + 1);
                        }
                    });

                    let markerLabelObject = {
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        text: `${stopMark.toString()}`,
                    };

                    this.markers.push({
                        position: {
                            lat: Number(value[0]),
                            lng: Number(value[1]),
                        },
                        label: markerLabelObject,

                        icon: cusomIcon,
                        opacity: 1.0,
                        options: {
                            animation: google.maps.Animation.DROP,
                        },
                    });
                });
            }
        });
        this.createWayPoints();
    }

    onMarkerClick(event: any, marker: MapMarker) {
        // This function is called when the marker is clicked
        // You can perform your desired actions here
        console.log('Marker Clicked!', marker, event);
    }

    // google Map add stops api calling
    AddStops() {
        this.currentFolder = 'Suggested stops';
        this.isEdit = false;
        this.displayFilter = true;
    }

    private _filter(name: string): Country[] {
        const filterValue = name.toLowerCase();

        return this.countryList.filter((option: any) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    // Save all input fields value
    getFilterEvent(e: any) {
        if (e.event == 'OptimizeRoute') {
            this.stopForm.markAllAsTouched();

            if (!this.stopForm.invalid) {
                this.saveStop(e.event);
            }
        } else if (e.event === 'AddNew') {
            this.stopForm.markAllAsTouched();
            if (!this.stopForm.invalid) {
                this.saveStop(e.event);
            }
        } else {
            this.displayFilter = false;
            this.stopForm.reset();
        }
    }

    // Navigate to live tracking screen
    publishRoute() {
        this.subscription.push(
            this.liveTracking
                .publishRoute(this.routeDetails?.routeDetailId)
                .subscribe(
                    (successData: any) => {
                        if (successData) {
                            this.router.navigate(['/home/live-tracking']);
                            this.commonSerivice.headerTitle.next(
                                'Live Tracking'
                            );
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Add stop', error.message);
                    }
                )
        );
    }

    displayFn(country: Country): any {
        return country;
    }

    // Save all the stops details
    saveStop(method: string) {
        let objData = {
            routeDetailId: this.routeDetails?.routeDetailId,
            name: this.stopForm.value.name,
            contactNo: this.stopForm.value.contactNo,
            fromTime: this.stopForm.value.fromTime,
            toTime: this.stopForm.value.toTime,
            address: this.stopForm.value.address,
            countryId: this.stopForm.value.countryId,
            city: this.stopForm.value.city,
            zipCode: this.stopForm.value.zipCode,
            state: this.stopForm.value.state,
            type: this.stopForm.value.type,
            remark: this.stopForm.value.remark,
        };
        this.subscription.push(
            this.stopService.addStop(objData).subscribe(
                (successData: any) => {
                    if (successData) {
                        if (method === 'OptimizeRoute') {
                            this.routeIdArray.push(successData.data);
                            this.optiimizeRoute(this.routeIdArray);
                            this.displayFilter = false;
                            this.stopForm.reset();
                        } else if (method === 'AddNew') {
                            this.routeIdArray.push(successData.data);
                            this.stopForm.reset();
                        }
                        this.toastr.success(
                            'Success',
                            'Stop Added Successfully'
                        );
                    }
                },
                (error: any) => {
                    this.toastr.error('Add stop', error.message);
                }
            )
        );
    }

    // Optimize from constraints
    addContarints() {
        const dialog = this.dialog.open(ConstarintsPopupComponent, {
            width: '60%',
            data: {
                // Your data goes here
                type: ['Assign Driver', 'Inter Dependent Stops'],
                routeProjectID: this.routeDetails?.routeDetailId,
                contentType: 'Suggested-stops',
            },
            autoFocus: false,
        });
        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
                this.routeIdArray = [];
                this.optiimizeRoute(this.routeIdArray);
            } else if (result.event == 'cancel') {
                this.toastr.error('Error', 'Constarints not added');
            }
        });
    }

    // Call optimize route api
    optiimizeRoute(data: any) {
        let userReq = {
            routeDetailId: this.routeDetails?.routeDetailId,
            routeStopDetailIds: data,
            unselectedRouteStopDetailIds: [],
        };

        this.stopService.optimizeRouteAddstops(userReq).subscribe(
            (successData: any) => {
                if (successData) {
                    this.toastr.success(
                        'Success',
                        'Route successfully optimized'
                    );
                    this.routeIdArray = [];
                    this.routeDetails = successData.data;
                    this.commonSerivice.optimizeRouteDetails?.next(
                        successData.data
                    );
                    this.setUpTrackingData();
                }
            },
            (error: any) => {
                this.toastr.error('Error', error.message);
            }
        );
    }

    // Creating routes
    createRoute() {
        //  Define the markers location
        this.markerLocation = this.routeDetails?.markers;

        // Define the waypoint location
        this.Waypoints = this.routeDetails?.waypoints;

        // Redirect to the center of location
        this.getCurrentLocation(this.routeDetails?.markers);

        // Create routes
        if (this.Waypoints && this.markerLocation) {
            this.markers = [];
            this.createUserRouting();
        }
    }

    // Create routing using waypoints
    createWayPoints() {
        this.Waypoints.forEach((wayPoint: any, i: number) => {
            let polyOptionsObject: any = {};

            polyOptionsObject.options = {
                strokeColor: this.arrayOfColor[i],
                strokeWeight: 4,
                strokeOpacity: 1,
            };

            let waypointsArray: { lat: number; lng: number }[] = [];
            for (let way of wayPoint) {
                way.map((ele: any, i: number) => {
                    let wayPoint = ele.split(',');
                    waypointsArray.push({
                        lat: Number(wayPoint[0]),
                        lng: Number(wayPoint[1]),
                    });
                });
            }
            polyOptionsObject.path = waypointsArray;

            this.polylines.push(polyOptionsObject);
        });
    }

    // Set current location from backend response
    getCurrentLocation(data: any) {
        console.log(data);

        // Find the first non-empty sub-array
        let locationArray;
        for (let i = 0; i < data.length; i++) {
            if (data[i].length > 0) {
                locationArray = data[i][0].split(',');
                break;
            }
        }

        if (locationArray) {
            let latValue = parseFloat(locationArray[0]);
            let lngValue = parseFloat(locationArray[1]);
            this.changeDetector.detectChanges();
            this.center = {
                lat: latValue,
                lng: lngValue,
            };
            this.changeDetector.detectChanges();
            this.zoom = 12;
        } else {
            console.error('No valid location data found.');
        }
    }

    counter(i: number) {
        return new Array(i);
    }

    interval: any;
    minValue = 0;
    maxValue = 16;
    step = 1;
    currentPosition = this.minValue;

    slideToMax(): void {
        this.interval = setInterval(() => {
            if (this.currentPosition >= this.maxValue) {
                clearInterval(this.interval);
                return;
            }

            // Increment the slider position
            this.currentPosition += this.step;
        }, 50); // Adjust the interval speed as needed
    }

    onStartTime(e: any) {
        // this.minValue = 0;
        // this.maxValue = 100;
        // clearInterval(this.interval);
        // this.step = 1;
        // this.currentPosition = this.minValue;
        // this.slideToMax();
    }

    onEndTime(e: any) {
        clearInterval(this.interval);
    }

    onTime(driverDetailId: any, stopDetails: any) {
        let userReq = {
            routeStopDetailId: stopDetails.routeStopDetailId[0],
            driverDetailId: driverDetailId,
            stopDetails: stopDetails,
        };

        const dialog = this.dialog.open(StopDetailsComponent, {
            width: '40%',
            autoFocus: false,
            data: userReq,
        });
        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
            } else if (result.event == 'cancel') {
            }
        });
    }

    // This method handles the drag and drop functionality
    onDragDrop(event: CdkDragDrop<any> | any): void {
        moveItemInArray(
            this.arrayOfDriverActivity,
            event.previousIndex,
            event.currentIndex
        );
    }

    drop(event: CdkDragDrop<any>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
}
