import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamicRouteService } from 'src/app/shared/services/dynamic-route.service';
import { LiveTrackingService } from 'src/app/shared/services/live-tracking.service';
import { formatDate } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CustomMarkerService } from 'src/app/shared/services/custom-marker.service';
import { ActivatedRoute } from '@angular/router';
import { decode } from '@googlemaps/polyline-codec';

@Component({
    selector: 'app-live-tracking',
    templateUrl: './live-tracking.component.html',
    styleUrls: ['./live-tracking.component.scss'],
})
export class LiveTrackingComponent implements OnInit, OnDestroy {
    // Form group for live tracking
    liveTrackForm: FormGroup = this.fb.group({
        sheet: [''],
        bus: [''],
    });

    selectedJson: any;

    // Error message
    errorMessage = '';

    // Array to store marker locations
    markerLocation: Array<any> = [];

    // Array to store vertices
    vertices: google.maps.LatLngLiteral[] = [];

    // Flag to indicate whether the Google Maps API is loaded
    apiLoaded = false;

    // Event type for showing driver activity (Default: 'DCL')
    eType = 'DCL';

    // Subscription array for managing observables
    subscription: Subscription[] = [];

    // Element Refrence of the google map
    @ViewChild('myGoogleMap', { static: false })
    maps!: GoogleMap;

    // Initial zoom level
    zoom = 10;

    // Options for polyline rendering
    polyLinesOptions: google.maps.PolylineOptions = {};

    // Array to store polylines
    polylines: any = [];

    // Options for rendering markers
    markerOptions: google.maps.MarkerOptions = {};

    // Array to store waypoints
    Waypoints: Array<any> = [];

    // Array to store completed driver waypoints
    driverCompletedWaypoints: Array<any> = [];

    // Google Waypoints
    googleWayPoints: any;

    // Array to store markers
    makerArray: any = [];

    // Center coordinates of the map
    center: google.maps.LatLngLiteral = { lat: 23.030847, lng: 72.563625 };

    // Map options
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        mapTypeId: 'roadmap' as unknown as google.maps.MapTypeId,
    };

    // Array to store markers on the map
    markers: any[] = [];

    // Array to store the number of drivers
    numOfDriver: any[] = [];

    // Array of driver markers
    driverMarkers = ['../../../assets/images/bluepin.png'];
    // Marker icon (optional)
    markerIcon: any = {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: { width: 32, height: 32 },
    };
    routeData: any;
    selectedRoutes: any = [];
    // Driver list
    sheetList: any = [];
    totalKm: any;
    totalTime: any;
    totalServiceTime: any;
    polylinePath: google.maps.LatLngLiteral[] = [];
    polylineOptions: google.maps.PolylineOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    };
    arrayOfColor = [
        '#88b5fa', // Light Blue
        '#F68FF6', // Light Pink
        '#fcc6b4', // Peach
        '#B4F6FF', // Pale Cyan
        '#4D93E7', // Royal Blue
        '#F6DF6C', // Light Yellow
        '#F68FF6', // Light Pink
        '#A46AEE', // Purple
        '#FF5733', // Red-Orange
        '#33A1FF', // Sky Blue
        '#FF8033', // Peachy Orange
        '#FF9933', // Sunset Orange
        '#581845', // Dark Purple
        '#FF33A1', // Hot Pink
        '#FF33F6', // Magenta
        '#33F6FF', // Aqua Blue
        '#FFC300', // Yellow-Orange
        '#5C6BC0', // Indigo
        '#8E44AD', // Amethyst Purple
        '#3498DB', // Dodger Blue
        '#E67E22', // Carrot Orange
        '#1ABC9C', // Teal Green
        '#F1C40F', // Golden Yellow
        '#D35400', // Pumpkin Orange
        '#E74C3C', // Coral Red
        '#9B59B6', // Violet
        '#2ECC71', // Emerald Green
    ];

    routePolylines: any = [];
    routeMarkers: any = [];

    id: any;
    projectData: any;
    busesList: any = [];
    selectedBus: any;
    selectedSheet: any;
    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private liveTrackingService: LiveTrackingService,
        private toastr: ToastrService,
        private customMarkerColor: CustomMarkerService
    ) {
        this.route.queryParams.subscribe((params) => {
            this.id = params['id']; // Get the 'id' query parameter
        });
    }

    ngOnInit(): void {
        // Subscribe to the Google Map observable to check if the API is loaded
        this.commonService.currentApiStatus
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: any) => {
                this.apiLoaded = value;
            });

        // Load the driver list
        this.getInfo(this.id);
    }

    // Subject to manage subscriptions
    private destroy$: Subject<void> = new Subject<void>();

    ngOnDestroy() {
        // Unsubscribe from all subscriptions to avoid memory leaks
        this.destroy$.next();
        this.destroy$.complete();
    }

    searchJsonDirect() {
        if (this.selectedJson) {
            this.setupLiveTracking(this.selectedJson);
        }
    }

    getInfo(data: any) {
        let req = { project_id: data };

        const fetchData = () => {
            const subscription = this.liveTrackingService
                .projectStatus(req)
                .subscribe(
                    (successData: any) => {
                        if (
                            successData &&
                            successData.project_row.response_data?.length > 0
                        ) {
                            this.projectData = successData.project_row;

                            // Get unique sheet names and add "All" option
                            this.sheetList = [
                                ...new Set(
                                    successData.project_row.response_data.map(
                                        (item: any) => item.sheet_name
                                    )
                                ),
                            ];

                            if (this.sheetList.length > 0) {
                                this.liveTrackForm.patchValue({ sheet: 'All' });

                                this.selectedSheet =
                                    successData.project_row.response_data;

                                // Extract all buses from all sheets when "All" is selected
                                this.busesList = [
                                    ...this.selectedSheet.flatMap(
                                        (x: any) => x.response?.vehicles || []
                                    ),
                                ];

                                // Default selection
                                this.liveTrackForm.patchValue({ bus: 'All' });
                                this.selectedBus = this.busesList;
                                // Compute total distance using the function
                                this.totalKm =
                                    this.calculateTotalDistance(null);
                                this.totalTime =
                                    this.calculateTotalTravelTime(null);
                                this.totalServiceTime =
                                    this.calculateTotalServiceTime(null);
                                this.selectedRoutes = [];
                                this.selectedSheet.forEach((element: any) => {
                                    element.response.vehicles.forEach(
                                        (value: any) => {
                                            this.selectedRoutes.push(value);
                                        }
                                    );
                                });

                                // Perform search
                                this.search();
                            }
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error.message);
                    }
                );
        };

        fetchData();
    }

    // Handle the sheet selection change event
    onChangeSheet(event: string) {
        if (event === 'All') {
            // If "All" is selected, include all buses from all sheets
            this.busesList = [
                ...this.projectData.response_data.flatMap(
                    (x: any) => x.response?.vehicles || []
                ),
            ];
            this.selectedSheet = this.projectData.response_data;
            this.selectedRoutes = [];
            this.selectedRoutes = this.busesList;
            // Compute total distance using the function
            this.totalKm = this.calculateTotalDistance(null);
            this.totalTime = this.calculateTotalTravelTime(null);
            this.totalServiceTime = this.calculateTotalServiceTime(null);
        } else {
            // Filter data based on the selected sheet
            let sheetData = this.projectData.response_data.find(
                (x: any) => x.sheet_name === event
            );

            this.busesList = [...(sheetData?.response?.vehicles || [])];
            this.selectedSheet = sheetData?.response;

            this.selectedRoutes = [];

            this.selectedRoutes = this.busesList;

            // Set total distance travelled for the selected sheet
            this.totalKm = this.calculateTotalDistance(
                sheetData?.response?.aggregate_metrics
                    ?.total_distance_travelled || 0
            );

            this.totalTime = this.calculateTotalTravelTime(
                sheetData?.response?.aggregate_metrics.total_travel_time ||
                    '00:00'
            );
            this.totalServiceTime = this.calculateTotalServiceTime(
                sheetData?.response?.aggregate_metrics.total_service_time ||
                    '00:00'
            );
        }

        // Set "All" as the default selection for buses
        this.liveTrackForm.patchValue({ bus: 'All' });
    }
    // Handle the bus selection change event
    onChangeBus(selectedBus: any) {
        if (selectedBus === 'All') {
            // Select all buses except "All"
            this.selectedBus = this.busesList.filter(
                (bus: any) => bus !== 'All'
            );

            // Set total distance travelled for the selected sheet
            this.totalKm = this.selectedBus
                .map((sheet: any) => sheet?.vehicle_distance_travelled || 0)
                .reduce((acc: number, curr: number) => acc + curr, 0)
                .toFixed(2);

            let totalMinutes = this.selectedBus
                .map((bus: any) => {
                    const [hours, minutes] = (
                        bus['vehicle_travel_time (hhmm)'].trim() || '00:00'
                    )
                        .split(':')
                        .map(Number);

                    return (hours || 0) * 60 + (minutes || 0); // Return total minutes
                })
                .reduce((acc: number, curr: number) => acc + curr, 0); // Sum up all minutes

            // Convert back to "hh h mm min" format
            const totalHours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;

            const formattedTime = `${totalHours
                .toString()
                .padStart(2, '0')}h ${remainingMinutes
                .toString()
                .padStart(2, '0')}min`;

            this.totalTime = formattedTime;
            let serviceTime = this.selectedBus
                .map((bus: any) => {
                    const [hours, minutes] = (
                        bus['vehicle_service_time (hhmm)'].trim() || '00:00'
                    )
                        .split(':')
                        .map(Number);

                    return (hours || 0) * 60 + (minutes || 0); // Return total minutes
                })
                .reduce((acc: number, curr: number) => acc + curr, 0); // Sum up all minutes

            // Convert back to "hh h mm min" format
            const totalHours1 = Math.floor(serviceTime / 60);
            const remainingMinutes1 = serviceTime % 60;

            const formattedTime1 = `${totalHours1
                .toString()
                .padStart(2, '0')}h ${remainingMinutes1
                .toString()
                .padStart(2, '0')}min`;
            this.totalServiceTime = formattedTime1;
            this.selectedRoutes = [];

            this.selectedRoutes = this.selectedBus;
        } else {
            this.selectedBus = selectedBus;

            // Set total distance travelled for the selected sheet
            this.totalKm = this.calculateTotalDistance(
                this.selectedBus.vehicle_distance_travelled || 0
            );

            this.totalTime = this.calculateTotalTravelTime(
                this.selectedBus?.['vehicle_travel_time (hhmm)']?.trim() ||
                    '00:00'
            );
            this.totalServiceTime = this.calculateTotalServiceTime(
                this.selectedBus?.['vehicle_service_time (hhmm)']?.trim() ||
                    '00:00'
            );
            this.selectedRoutes = [];
            this.selectedRoutes.push(this.selectedBus);
        }
    }
    calculateTotalDistance(value: number | null): string {
        let totalDistance: number;

        if (value !== null && value !== undefined) {
            // If `value` is provided, use it directly
            totalDistance = value;
        } else {
            // If `value` is not provided, compute the total from projectData
            totalDistance = this.projectData.response_data
                .map(
                    (sheet: any) =>
                        sheet.response?.aggregate_metrics
                            ?.total_distance_travelled || 0
                )
                .reduce((acc: number, curr: number) => acc + curr, 0);
        }

        return totalDistance.toFixed(2); // Ensure two decimal places
    }
    calculateTotalTravelTime(value: string | null): string {
        let totalMinutes: number;

        if (value) {
            // If `value` is provided, process it directly
            const [hours, minutes] = value.trim().split(':').map(Number);
            totalMinutes = (hours || 0) * 60 + (minutes || 0);
        } else {
            // If `value` is not provided, compute the total from projectData
            totalMinutes = this.projectData.response_data
                .flatMap((sheet: any) => sheet.response?.vehicles || [])
                .map((bus: any) => {
                    const [hours, minutes] = (
                        bus['vehicle_travel_time (hhmm)'].trim() || '00:00'
                    )
                        .split(':')
                        .map(Number);
                    return (hours || 0) * 60 + (minutes || 0);
                })
                .reduce((acc: any, curr: any) => acc + curr, 0);
        }

        // Convert back to "hh h mm min" format
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        return `${totalHours.toString().padStart(2, '0')}h ${remainingMinutes
            .toString()
            .padStart(2, '0')}min`;
    }
    calculateTotalServiceTime(value: string | null): string {
        let totalMinutes: number;

        if (value) {
            // If `value` is provided, process it directly
            const [hours, minutes] = value.trim().split(':').map(Number);
            totalMinutes = (hours || 0) * 60 + (minutes || 0);
        } else {
            // If `value` is not provided, compute the total from projectData
            totalMinutes = this.projectData.response_data
                .flatMap((sheet: any) => sheet.response?.vehicles || [])
                .map((bus: any) => {
                    const [hours, minutes] = (
                        bus['vehicle_service_time (hhmm)'].trim() || '00:00'
                    )
                        .split(':')
                        .map(Number);
                    return (hours || 0) * 60 + (minutes || 0);
                })
                .reduce((acc: any, curr: any) => acc + curr, 0);
        }

        // Convert back to "hh h mm min" format
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        return `${totalHours.toString().padStart(2, '0')}h ${remainingMinutes
            .toString()
            .padStart(2, '0')}min`;
    }
    // Search for driver information and display it on the map
    search() {
        this.routePolylines = [];
        this.routeMarkers = [];
        const markerPositionMap = new Map<string, number>(); // Track duplicate positions

        if (this.selectedRoutes && this.selectedRoutes.length > 0) {
            this.selectedRoutes.forEach((element: any, routeIndex: number) => {
                if (element?.overview_polyline) {
                    const escapedEncodedPolyline =
                        element.overview_polyline.replace(/[^\x20-\x7E]/g, '');
                    const decodedPath = decode(escapedEncodedPolyline);

                    this.routePolylines.push({
                        path: decodedPath.map(([lat, lng]) => ({ lat, lng })),
                        options: {
                            strokeColor: this.arrayOfColor[routeIndex],
                            strokeWeight: 4,
                            strokeOpacity: 1,
                        },
                    });

                    if (this.routePolylines.length > 0) {
                        this.center = this.routePolylines[0].path[0];
                    }
                }

                if (element?.route_transition?.length) {
                    element.route_transition.forEach(
                        (stop: any, index: number) => {
                            if (stop['Point Coordination']) {
                                let [lat, lng] = stop['Point Coordination']
                                    .split(',')
                                    .map((coord: any) =>
                                        parseFloat(coord.trim())
                                    );

                                if (!isNaN(lat) && !isNaN(lng)) {
                                    let key = `${lat},${lng}`;
                                    let count = markerPositionMap.get(key) || 0;

                                    // Offset to avoid overlap
                                    const offset = count * 0.0001; // Adjust offset value as needed
                                    lat += offset;
                                    lng += offset;
                                    markerPositionMap.set(key, count + 1);

                                    let markerColor =
                                        this.arrayOfColor[routeIndex];
                                    let tooltipText = `Route ${routeIndex} - ${stop['Student Name']} / Address: ${stop['Point Address']}`;

                                    if (index === 0) {
                                        markerColor = 'red';
                                        tooltipText += ' (Start Point)';
                                    }

                                    if (
                                        index ===
                                        element.route_transition.length - 1
                                    ) {
                                        if (index === 0) {
                                            markerColor = 'purple';
                                            tooltipText += ' & (End Point)';
                                        } else {
                                            markerColor = 'green';
                                            tooltipText += ' (End Point)';
                                        }
                                    }

                                    this.routeMarkers.push({
                                        position: { lat, lng },
                                        label: `${routeIndex}-${index}`,
                                        title: tooltipText,
                                        icon: {
                                            path: google.maps.SymbolPath.CIRCLE,
                                            fillColor: markerColor,
                                            fillOpacity: 1,
                                            scale: 12,
                                            strokeColor: 'white',
                                            strokeWeight: 2,
                                        },
                                    });
                                }
                            }
                        }
                    );
                }
            });
        }
    }

    downloadFile() {
        let base64Data = this.selectedSheet?.excel_b64;
        let fileName = this.selectedSheet?.excel_filename;
        const byteCharacters = atob(base64Data); // Decode Base64
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = fileName.endsWith('.xlsx')
            ? fileName
            : fileName + '.xlsx'; // Ensure .xlsx extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Cleanup
    }
    // Process and display live tracking information on the map
    setupLiveTracking(routeData: any) {
        routeData = JSON.parse(routeData);

        this.markerLocation = [];
        this.Waypoints = [];
        this.driverCompletedWaypoints = [];
        this.makerArray = [];
        this.polylines = [];

        // Define the markers location
        this.markerLocation = routeData?.MarkerLocation;

        // Define the waypoint location
        this.Waypoints = routeData?.Waypoints;
        this.driverCompletedWaypoints = routeData?.driverwaypoints;
        this.googleWayPoints = routeData?.googleWaypoints;

        // Set the center of the map to the initial location
        this.getCurrentLocation(routeData?.MarkerLocation);

        // Create routes and markers
        if (this.Waypoints && this.markerLocation) {
            this.markers = [];
            this.createUserRouting(routeData);
        }
    }

    // Set the center of the map to the initial location
    getCurrentLocation(data: any) {
        let locationArray = data[0][0].split(',');
        let latValue = parseFloat(locationArray[0]);
        let lngValue = parseFloat(locationArray[1]);

        this.center = {
            lat: latValue,
            lng: lngValue,
        };

        this.zoom = 12;
    }

    createUserRouting(routeData: any) {
        this.markerOptions = {
            opacity: 1.0,
            animation: google.maps.Animation.DROP,
            optimized: true,
            zIndex: 1,
        };

        this.markers = [];

        this.markerLocation.forEach((markerGroup: any) => {
            const uniqueMarkers = [...new Set(markerGroup)];
            uniqueMarkers.forEach((marker: any, i) => {
                const stopMark = markerGroup.reduce(
                    (indices: any, ele: any, index: any) => {
                        if (ele === marker) {
                            indices.push(index + 1);
                        }
                        return indices;
                    },
                    []
                );

                const [lat, lng] = marker.split(',');
                const markerLabelObject = {
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    text: stopMark.join(', '),
                };

                let color = '#007bff';
                let cusomIcon = this.customMarkerColor.setFillColor(color);
                this.markers.push({
                    position: {
                        lat: Number(lat),
                        lng: Number(lng),
                    },
                    label: markerLabelObject,
                    opacity: 1.0,
                    icon: cusomIcon,
                    options: {
                        animation: google.maps.Animation.DROP,
                    },
                });
            });
        });

        this.createWayPoints();
    }

    // Create waypoints and polylines on the map
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
}
