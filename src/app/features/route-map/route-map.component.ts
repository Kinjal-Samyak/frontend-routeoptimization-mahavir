import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { DynamicRouteService } from 'src/app/shared/services/dynamic-route.service';
@Component({
    selector: 'app-route-map',
    templateUrl: './route-map.component.html',
    styleUrls: ['./route-map.component.scss'],
})
export class RouteMapComponent implements OnInit {
    sendEmptyArray: boolean = true;

    //Upload the files
    uploadedFile: any;

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

    DummyData = {
        Lastdatetime: '2023-06-09T05:08:32.0615593Z',
        TotalStop: 10,
        NoOfStop: 0,
        optimizeroute: {
            DispatchNo: '191674',
            MarkerLocation: [
                [
                    '39.6943468,-105.0015128',
                    '39.6943468,-105.0015128',
                    '39.6521716,-104.9141791',
                    '39.6268794,-104.8840429',
                    '39.6393941,-104.7938658',
                ],
                [
                    '39.6943468,-105.0015128',
                    '39.6943468,-105.0015128',
                    '39.6000451,-104.8033041',
                    '39.6148893,-104.7584587',
                    '39.6546224,-104.776062',
                ],
                [
                    '39.6943468,-105.0015128',
                    '39.6943468,-105.0015128',
                    '39.608391,-104.9227705',
                    '39.5589648,-104.9072928',
                    '39.5418895,-104.9442785',
                ],
            ],
            OptimizeRoutes: [
                [
                    {
                        Address: '1220 S. LIPAN ST',
                        City: 'Denver',
                        CompanyName: 'Kroger DC',
                        Country: 'USA',
                        CustomerCode: '1',
                        Latitude: 39.6943426,
                        Longitude: -105.0012267,
                        Markers: 'A',
                        SerialNo: 1,
                        ServiceTime: 15,
                        ServiceType: 'Pickup',
                        State: 'CO',
                        ZipCode: '80223',
                        TimeDuration: null,
                        DistanceTravelled: 0,
                        ConnectStop: '1',
                        SuggestedStop: 1,
                        UniqueAddressStop: 1,
                        JobNo: 33112631,
                    },
                    {
                        Address: '6470 E HAMPTON AVE',
                        City: 'DENVER',
                        CompanyName: '620-026',
                        Country: 'USA',
                        CustomerCode: '3',
                        Latitude: 39.6518351,
                        Longitude: -104.9141556,
                        Markers: 'E',
                        SerialNo: 5,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80222',
                        TimeDuration: '0:27',
                        DistanceTravelled: 7.53,
                        ConnectStop: '3',
                        SuggestedStop: 2,
                        UniqueAddressStop: 2,
                        JobNo: 33112631,
                    },
                    {
                        Address: '4910 S YOSEMITE',
                        City: 'GREENWOOD VILLAGE',
                        CompanyName: '620-100',
                        Country: 'USA',
                        CustomerCode: '4',
                        Latitude: 39.6265749,
                        Longitude: -104.8840471,
                        Markers: 'F',
                        SerialNo: 6,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80110',
                        TimeDuration: '0:23',
                        DistanceTravelled: 3.51,
                        ConnectStop: '4',
                        SuggestedStop: 3,
                        UniqueAddressStop: 3,
                        JobNo: 33112632,
                    },
                    {
                        Address: '4271 S BUCKLEY RD',
                        City: 'Aurora',
                        CompanyName: '620-069',
                        Country: 'USA',
                        CustomerCode: '6',
                        Latitude: 39.6393879,
                        Longitude: -104.7934826,
                        Markers: 'G',
                        SerialNo: 7,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80013',
                        TimeDuration: '0:27',
                        DistanceTravelled: 7.22,
                        ConnectStop: '6',
                        SuggestedStop: 4,
                        UniqueAddressStop: 5,
                        JobNo: 33112634,
                    },
                ],
                [
                    {
                        Address: '1220 S. LIPAN ST',
                        City: 'Denver',
                        CompanyName: 'Kroger DC',
                        Country: 'USA',
                        CustomerCode: '1',
                        Latitude: 39.6943426,
                        Longitude: -105.0012267,
                        Markers: 'A',
                        SerialNo: 1,
                        ServiceTime: 15,
                        ServiceType: 'Pickup',
                        State: 'CO',
                        ZipCode: '80223',
                        TimeDuration: null,
                        DistanceTravelled: 0,
                        ConnectStop: '1',
                        SuggestedStop: 1,
                        UniqueAddressStop: 1,
                        JobNo: 33112631,
                    },
                    {
                        Address: '6412 S. PARKER ROAD',
                        City: 'AURORA',
                        CompanyName: '620-084',
                        Country: 'USA',
                        CustomerCode: '8',
                        Latitude: 39.6002506,
                        Longitude: -104.8029355,
                        Markers: 'E',
                        SerialNo: 5,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80016',
                        TimeDuration: '0:39',
                        DistanceTravelled: 16.98,
                        ConnectStop: '8',
                        SuggestedStop: 2,
                        UniqueAddressStop: 7,
                        JobNo: 33112636,
                    },
                    {
                        Address: '19711 E SMOKY HILL RD',
                        City: 'Aurora',
                        CompanyName: '620-016',
                        Country: 'USA',
                        CustomerCode: '7',
                        Latitude: 39.615211,
                        Longitude: -104.758471,
                        Markers: 'F',
                        SerialNo: 6,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80016',
                        TimeDuration: '0:24',
                        DistanceTravelled: 4.14,
                        ConnectStop: '7',
                        SuggestedStop: 3,
                        UniqueAddressStop: 6,
                        JobNo: 33112635,
                    },
                    {
                        Address: '18211 E HAMPDEN AVE',
                        City: 'Aurora',
                        CompanyName: '620-128',
                        Country: 'USA',
                        CustomerCode: '5',
                        Latitude: 39.6549169,
                        Longitude: -104.7759777,
                        Markers: 'G',
                        SerialNo: 7,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80013',
                        TimeDuration: '0:26',
                        DistanceTravelled: 3.68,
                        ConnectStop: '5',
                        SuggestedStop: 4,
                        UniqueAddressStop: 4,
                        JobNo: 33112633,
                    },
                ],
                [
                    {
                        Address: '1220 S. LIPAN ST',
                        City: 'Denver',
                        CompanyName: 'Kroger DC',
                        Country: 'USA',
                        CustomerCode: '1',
                        Latitude: 39.6943426,
                        Longitude: -105.0012267,
                        Markers: 'A',
                        SerialNo: 1,
                        ServiceTime: 15,
                        ServiceType: 'Pickup',
                        State: 'CO',
                        ZipCode: '80223',
                        TimeDuration: null,
                        DistanceTravelled: 0,
                        ConnectStop: '1',
                        SuggestedStop: 1,
                        UniqueAddressStop: 1,
                        JobNo: 33112631,
                    },
                    {
                        Address: '6000 S HOLLY ST',
                        City: 'GREENWOOD VILLAGE',
                        CompanyName: '620-096',
                        Country: 'USA',
                        CustomerCode: '9',
                        Latitude: 39.6083919,
                        Longitude: -104.9227705,
                        Markers: 'E',
                        SerialNo: 5,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80121',
                        TimeDuration: '0:32',
                        DistanceTravelled: 12.35,
                        ConnectStop: '9',
                        SuggestedStop: 2,
                        UniqueAddressStop: 8,
                        JobNo: 33112637,
                    },
                    {
                        Address: '8673 S QUEBEC ST',
                        City: 'HIGHLANDS RANCH',
                        CompanyName: '620-110',
                        Country: 'USA',
                        CustomerCode: '10',
                        Latitude: 39.5588137,
                        Longitude: -104.9076773,
                        Markers: 'F',
                        SerialNo: 6,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80130',
                        TimeDuration: '0:27',
                        DistanceTravelled: 4.75,
                        ConnectStop: '10',
                        SuggestedStop: 3,
                        UniqueAddressStop: 9,
                        JobNo: 33112638,
                    },
                    {
                        Address: '9551 S UNIVERSITY BLVD',
                        City: 'HIGHLANDS RANCH',
                        CompanyName: '620-027',
                        Country: 'USA',
                        CustomerCode: '11',
                        Latitude: 39.5422515,
                        Longitude: -104.9442698,
                        Markers: 'G',
                        SerialNo: 7,
                        ServiceTime: 15,
                        ServiceType: 'Delivery',
                        State: 'CO',
                        ZipCode: '80126',
                        TimeDuration: '0:22',
                        DistanceTravelled: 3.23,
                        ConnectStop: '11',
                        SuggestedStop: 4,
                        UniqueAddressStop: 10,
                        JobNo: 33112639,
                    },
                ],
            ],
            TotalDeliveryTime: ['2:02', '2:14', '2:06'],
            TotalDistanceTravelled: [18.26, 24.8, 20.33],
            TotalServiceTime: ['1:30', '1:30', '1:30'],
            TotalTravelTime: ['0:32', '0:44', '0:36'],
            Units: {
                DistanceTravelled: 'Miles',
                TimeDuration: 'HH:MM',
            },
            VehicleCapacity: [8, 8, 8],
            Waypoints: [
                [
                    ['39.6943468,-105.0015128', '39.6943468,-105.0015128'],
                    [
                        '39.6966997,-105.0015016',
                        '39.6966688,-104.992147',
                        '39.7019386,-104.9938666',
                        '39.7045148,-104.9960554',
                        '39.6571923,-104.9203656',
                        '39.6532007,-104.9190846',
                        '39.6530296,-104.9143642',
                        '39.6527803,-104.9143801',
                        '39.6527831,-104.9141818',
                        '39.6521716,-104.9141791',
                    ],
                    [
                        '39.6521713,-104.9143684',
                        '39.6530296,-104.9143642',
                        '39.6530135,-104.8848785',
                        '39.6271224,-104.8853548',
                        '39.6271227,-104.8845198',
                        '39.6268833,-104.8845251',
                        '39.6268794,-104.8840429',
                    ],
                    [
                        '39.6268833,-104.8845251',
                        '39.6271227,-104.8845198',
                        '39.627119,-104.8852027',
                        '39.6388191,-104.88504',
                        '39.6565613,-104.8467167',
                        '39.6574096,-104.8440556',
                        '39.6386344,-104.8290738',
                        '39.6384338,-104.7937645',
                        '39.6387978,-104.7937388',
                        '39.6393941,-104.7938658',
                    ],
                ],
                [
                    ['39.6943468,-105.0015128', '39.6943468,-105.0015128'],
                    [
                        '39.6966997,-105.0015016',
                        '39.6966688,-104.992147',
                        '39.7019386,-104.9938666',
                        '39.7045148,-104.9960554',
                        '39.5978476,-104.8867907',
                        '39.59476919999999,-104.8863965',
                        '39.5945967,-104.8855845',
                        '39.5948138,-104.8028929',
                        '39.5998711,-104.8048677',
                        '39.6001665,-104.8040181',
                        '39.5998569,-104.8038436',
                        '39.6000451,-104.8033041',
                    ],
                    [
                        '39.5998569,-104.8038436',
                        '39.6001665,-104.8040181',
                        '39.5998711,-104.8048677',
                        '39.6100588,-104.8103104',
                        '39.6084035,-104.7694968',
                        '39.6123618,-104.7641788',
                        '39.6153289,-104.7644215',
                        '39.61461389999999,-104.7605102',
                        '39.6148913,-104.7592668',
                        '39.6148893,-104.7584587',
                    ],
                    [
                        '39.6145105,-104.7568041',
                        '39.6154042,-104.7541344',
                        '39.6308495,-104.7543141',
                        '39.6470699,-104.7723768',
                        '39.6529593,-104.7723669',
                        '39.6531067,-104.7756566',
                        '39.654381,-104.7753035',
                        '39.6546224,-104.776062',
                    ],
                ],
                [
                    ['39.6943468,-105.0015128', '39.6943468,-105.0015128'],
                    [
                        '39.6966997,-105.0015016',
                        '39.6966688,-104.992147',
                        '39.7019386,-104.9938666',
                        '39.7045148,-104.9960554',
                        '39.6123391,-104.8951799',
                        '39.6096328,-104.8942908',
                        '39.6095988,-104.9188475',
                        '39.6067649,-104.9190213',
                        '39.6063028,-104.9227946',
                        '39.608391,-104.9227705',
                    ],
                    [
                        '39.6095578,-104.9227975',
                        '39.6095085,-104.9041793',
                        '39.5580071,-104.9066699',
                        '39.5589648,-104.9072928',
                    ],
                    [
                        '39.5580071,-104.9066699',
                        '39.5425669,-104.9128293',
                        '39.5439417,-104.9430521',
                        '39.5426424,-104.9433871',
                        '39.5418757,-104.9433647',
                        '39.5418895,-104.9442785',
                    ],
                ],
            ],
            Version: {
                Major: 1,
                Minor: 1,
                Build: -1,
                Revision: -1,
                MajorRevision: -1,
                MinorRevision: -1,
            },
            Content: null,
            StatusCode: 200,
            ReasonPhrase: 'OK',
            Headers: [],
            TrailingHeaders: [],
            RequestMessage: null,
            IsSuccessStatusCode: true,
        },
        ShipmentDetails: [
            {
                JobNo: 33112632,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 3,
                DelStop: 4,
                DeliveryCompany: '620-100',
                DeliveryAddress: '4910 S YOSEMITE',
                DeliveryCity: 'GREENWOOD VILLAGE',
                DeliveryState: 'CO',
                DriverIndex: 0,
                DriverName: 'Driver 1',
            },
            {
                JobNo: 33112633,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 4,
                DelStop: 5,
                DeliveryCompany: '620-128',
                DeliveryAddress: '18211 E HAMPDEN AVE',
                DeliveryCity: 'Aurora',
                DeliveryState: 'CO',
                DriverIndex: 1,
                DriverName: 'Driver 2',
            },
            {
                JobNo: 33112634,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 4,
                DelStop: 6,
                DeliveryCompany: '620-069',
                DeliveryAddress: '4271 S BUCKLEY RD',
                DeliveryCity: 'Aurora',
                DeliveryState: 'CO',
                DriverIndex: 0,
                DriverName: 'Driver 1',
            },
            {
                JobNo: 33112635,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 3,
                DelStop: 7,
                DeliveryCompany: '620-016',
                DeliveryAddress: '19711 E SMOKY HILL RD',
                DeliveryCity: 'Aurora',
                DeliveryState: 'CO',
                DriverIndex: 1,
                DriverName: 'Driver 2',
            },
            {
                JobNo: 33112636,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 2,
                DelStop: 8,
                DeliveryCompany: '620-084',
                DeliveryAddress: '6412 S. PARKER ROAD',
                DeliveryCity: 'AURORA',
                DeliveryState: 'CO',
                DriverIndex: 1,
                DriverName: 'Driver 2',
            },
            {
                JobNo: 33112637,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 2,
                DelStop: 9,
                DeliveryCompany: '620-096',
                DeliveryAddress: '6000 S HOLLY ST',
                DeliveryCity: 'GREENWOOD VILLAGE',
                DeliveryState: 'CO',
                DriverIndex: 2,
                DriverName: 'Driver 3',
            },
            {
                JobNo: 33112638,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 3,
                DelStop: 10,
                DeliveryCompany: '620-110',
                DeliveryAddress: '8673 S QUEBEC ST',
                DeliveryCity: 'HIGHLANDS RANCH',
                DeliveryState: 'CO',
                DriverIndex: 2,
                DriverName: 'Driver 3',
            },
            {
                JobNo: 33112639,
                PuStop: 0,
                SuggestedPickupStop: 0,
                PickupCompany: null,
                PickupAddress: null,
                PickupCity: null,
                PickupState: null,
                SuggestedDeliveryStop: 4,
                DelStop: 11,
                DeliveryCompany: '620-027',
                DeliveryAddress: '9551 S UNIVERSITY BLVD',
                DeliveryCity: 'HIGHLANDS RANCH',
                DeliveryState: 'CO',
                DriverIndex: 2,
                DriverName: 'Driver 3',
            },
            {
                JobNo: 33112631,
                PuStop: 1,
                SuggestedPickupStop: 1,
                PickupCompany: 'Kroger DC',
                PickupAddress: '1220 S. LIPAN ST',
                PickupCity: 'Denver',
                PickupState: 'CO',
                SuggestedDeliveryStop: 0,
                DelStop: 0,
                DeliveryCompany: null,
                DeliveryAddress: null,
                DeliveryCity: null,
                DeliveryState: null,
                DriverIndex: 1,
                DriverName: 'Driver 2',
            },
            {
                JobNo: 33112631,
                PuStop: 1,
                SuggestedPickupStop: 1,
                PickupCompany: 'Kroger DC',
                PickupAddress: '1220 S. LIPAN ST',
                PickupCity: 'Denver',
                PickupState: 'CO',
                SuggestedDeliveryStop: 0,
                DelStop: 0,
                DeliveryCompany: null,
                DeliveryAddress: null,
                DeliveryCity: null,
                DeliveryState: null,
                DriverIndex: 2,
                DriverName: 'Driver 3',
            },
            {
                JobNo: 33112631,
                PuStop: 1,
                SuggestedPickupStop: 1,
                PickupCompany: 'Kroger DC',
                PickupAddress: '1220 S. LIPAN ST',
                PickupCity: 'Denver',
                PickupState: 'CO',
                SuggestedDeliveryStop: 2,
                DelStop: 3,
                DeliveryCompany: '620-026',
                DeliveryAddress: '6470 E HAMPTON AVE',
                DeliveryCity: 'DENVER',
                DeliveryState: 'CO',
                DriverIndex: 0,
                DriverName: 'Driver 1',
            },
        ],
    };

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

    // Color for the polyline route
    routeColor: string = '#FF0000'; // Red color
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

    polylineOptions: google.maps.PolylineOptions = {
        path: this.vertices,
        strokeColor: '#000000', // Red color
        strokeWeight: 3,
    };

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
        this.dataSourceArray = [];
        this.dataSource2 = [];
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
            fileUpload: [''],
        });
        this.updateCenter();
        // this.getAllDriver();
    }

    setGoogleMap(dataOrIndex: any) {
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

    // Create routing using waypoints
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

    // Get optimizations details using ID
    getJsonvData() {
        if (this.uploadedFile) {
            const formData = new FormData();
            formData.append('file', this.uploadedFile); // Append the file to FormData

            console.log(formData);
            this.subscription.push(
                this.dynamicService
                    .getOptimizedRouteDetails(formData)
                    .subscribe(
                        (successData: any) => {
                            if (successData) {
                                // Bind data based on request type
                                if (
                                    successData?.optimizeroute.OptimizeRoutes
                                        ?.length > 1
                                ) {
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
                                        this.setData2(
                                            successData?.ShipmentDetails
                                        );
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
                                        this.setData2(
                                            successData?.ShipmentDetails
                                        );
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
                                        if (
                                            this.Waypoints &&
                                            this.markerLocation
                                        ) {
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

    parseCSV(csvText: string): string[][] {
        const lines: string[] = csvText.split('\n');
        const csvData: string[][] = [];

        for (let i = 0; i < lines.length; i++) {
            const line: string = lines[i].trim();

            if (line !== '') {
                const row: string[] = line.split(',');
                csvData.push(row);
            }
        }

        return csvData;
    }

    // Select file and check if it is json or csv
    onChange(event: any) {
        const file: File = event.target.files[0];

        if (file) {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
                const contents: string = e.target.result;
                const fileType: string = file.type;

                if (fileType === 'application/json') {
                    // Handle JSON file
                    this.uploadedFile = contents;

                    // const jsonData: any = JSON.parse(contents);
                    // console.log('JSON data:', jsonData);
                } else if (fileType === 'text/csv') {
                    // Handle CSV file
                    this.uploadedFile = contents;
                    console.log(this.uploadedFile);
                    // const csvData: string[][] = this.parseCSV(contents);
                    // console.log('CSV data:', csvData);
                }
            };

            reader.readAsText(file);
        }
    }
}
