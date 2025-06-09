import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
    selector: 'app-map-history',
    templateUrl: './map-history.component.html',
    styleUrls: ['./map-history.component.scss'],
})
export class MapHistoryComponent implements OnInit {
    @Input() childData: any;

    // Array of Subscribers
    subscription: Subscription[] = [];

    // Details for routes
    routeMapDetails: any;

    markers: any;
    zoom = 10;

    // Load google api
    apiLoaded!: Boolean;

    markerOptions: google.maps.MarkerOptions = {};

    // Create the polylines
    vertices: google.maps.LatLngLiteral[] = [];

    // Change the color of the routes
    polyLinesOptions!: google.maps.PolylineOptions;

    polylines: any = [];

    // Element Refrence of the google map
    @ViewChild('myGoogleMap', { static: false })
    maps!: GoogleMap;

    // Show the center of the google locantion
    center: google.maps.LatLngLiteral = { lat: 23.030847, lng: 72.563625 };

    markerLocation: any = [];
    Waypoints: any = [];
    makerArray: any = [];

    // Google map option
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        mapTypeId: 'roadmap' as unknown as google.maps.MapTypeId,
    };

    constructor(
        private commonSerivice: CommonService,
        private changeDetector: ChangeDetectorRef
    ) {}

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

        if (this.childData && this.apiLoaded) {
            this.routeMapDetails = this.childData;
            this.setUpTrackingData();
        }
    }

    setUpTrackingData() {
        this.markerLocation = [];
        this.Waypoints = [];
        this.makerArray = [];

        //  Define the markers location
        this.markerLocation = [this.routeMapDetails?.markers];

        // Define the waypoint location
        this.Waypoints = [this.routeMapDetails?.waypoints];

        // Redirect to the center of location
        this.getCurrentLocation([this.routeMapDetails?.markers]);

        // Create routes
        if (this.Waypoints && this.markerLocation) {
            this.markers = [];
            this.createUserRouting();
        }
    }

    // Set current location from backend response
    getCurrentLocation(data: any) {
        let locationArray = data[0][0].split(',');

        let latValue = parseFloat(locationArray[0]);
        let lngValue = parseFloat(locationArray[1]);
        this.center = {
            lat: latValue,
            lng: lngValue,
        };
        this.changeDetector.detectChanges();
        this.zoom = 12;
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
            // // set marker location
            // let cusomIcon = this.customMarkerIcon.setFillColor(
            //     this.arrayOfColor[index]
            // );
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
                    opacity: 1.0,
                    options: {
                        animation: google.maps.Animation.DROP,
                    },
                });
            });
        });
        this.createWayPoints();
    }

    // Create routing using waypoints
    createWayPoints() {
        this.Waypoints.forEach((wayPoint: any, i: number) => {
            let polyOptionsObject: any = {};

            polyOptionsObject.options = {
                strokeColor: '#000000',
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
