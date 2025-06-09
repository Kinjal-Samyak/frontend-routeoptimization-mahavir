/* eslint-disable @typescript-eslint/no-empty-function */
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, formatDate } from '@angular/common';
import { UploadDataPopupComponent } from 'src/app/shared/component/upload-data-popup/upload-data-popup.component';
import { MatDialog } from '@angular/material/dialog';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ColumnMappingComponent } from 'src/app/shared/component/column-mapping/column-mapping.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstarintsPopupComponent } from 'src/app/shared/component/constarints-popup/constarints-popup.component';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmPopupComponent } from 'src/app/shared/component/confirm-popup/confirm-popup.component';
import { Country } from 'src/app/shared/model/country.model';
import { SelectionModel } from '@angular/cdk/collections';
import { StopService } from 'src/app/shared/services/stop.service';
import { constantFunction } from 'src/app/shared/constants/constantFunction.constant';
import { ToastrService } from 'ngx-toastr';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { DriverService } from 'src/app/shared/services/driver.service';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
    selector: 'app-stops',
    templateUrl: './stops.component.html',
    styleUrls: ['./stops.component.scss'],
    providers: [DatePipe],
})
export class StopsComponent implements OnInit, OnDestroy {
    stopIdNo: any;
    dropStateList: any;
    dropCityList: any;
    selectedModelIds: Array<string> = [];
    selection = new SelectionModel<[]>(true, []);
    noDataDisplay = false;
    routeProjectDetailId: any;
    selected: any;
    project = new FormControl('');
    selectedProject: any;
    selectedProjectData: any;
    showInput: boolean = false;
    assignedDrivers = [];
    // hostlistner to close filter
    @HostListener('click', ['$event'])
    outSideClickFunction(event: any) {
        if (event.target.classList.value === 'row filter-wrapper') {
            this.displayFilter = false;
        }
    }
    // send the input value
    currentFolder: string = 'Stops';
    // Pop-up form data
    stopForm!: FormGroup;
    projectForm!: FormGroup;
    // show the filter
    displayFilter = false;
    //filter template
    @ViewChild('filter', { read: ViewContainerRef }) filter: any;
    displayedColumns = [
        'checkbox',
        'idNo',
        'name',
        'address',
        'city',
        'state',
        'zipCode',
        'type',
        'contactNo',
        'time',
        'action',
    ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    previousStopList: any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    subscriptions: Subscription[] = [];
    submitted: boolean = false;
    errorMsg: any;
    successMessage: any;

    unselectedStops: any = [];
    stopList: any;

    actInfo: any;
    isEdit: boolean = false;
    showEditTable: boolean = true;
    editRowID: any = '';
    countryList: { name: string; countryId: string }[];
    filteredOptions: any = new Observable<Country[]>();
    inputProject: any;
    projectList: any;
    constructor(
        private auth: AuthService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public router: Router,
        public stopService: StopService,
        private commonService: CommonService,
        private userService: UserService,
        private driverService: DriverService,
        private toastr: ToastrService
    ) {
        this.routeProjectDetailId = sessionStorage.getItem('selectedProject');
        this.initform();

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
    }

    ngOnInit(): void {
        this.getListOfCountry();
        this.bindProjects();
    }

    getListOfCountry() {
        this.subscriptions.push(
            this.userService.getContryList().subscribe(
                (successData: any) => {
                    if (successData.code == 200) {
                        this.countryList = successData.data;

                        this.filteredOptions = this.stopForm
                            .get('countryId')
                            ?.valueChanges.pipe(
                                startWith(''),
                                map((value) => {
                                    const name =
                                        typeof value === 'string'
                                            ? value
                                            : value?.name;
                                    return name
                                        ? this._filter(name as string)
                                        : this.countryList.slice();
                                })
                            );
                    }
                },
                (error: any) => {
                    this.toastr.error('Country list', error.message);
                }
            )
        );
    }

    // Get all assigned drive to show which driver is assigned to the routes
    getAssignedDriverList() {
        this.driverService.getDriversList().subscribe(
            (successData: any) => {
                let driverList = successData.data;

                this.stopService
                    .getAssignedDriverList(this.routeProjectDetailId)
                    .subscribe(
                        (successData: any) => {
                            // Extract the driverDetailIds from successData
                            const routeDriverDetailIds = successData.data.map(
                                (route: any) => route.driverDetailId
                            );

                            // Filter the driverList array based on the matching driverDetailIds
                            const matchedDrivers = driverList.filter(
                                (driver: any) =>
                                    routeDriverDetailIds.includes(
                                        driver.driverDetailId
                                    )
                            );

                            this.assignedDrivers = matchedDrivers.map(
                                (value: any) => {
                                    return `${value.firstName + ' '}${
                                        value.lastName ? value.lastName : ''
                                    }${
                                        '(' +
                                        value.shiftTimingFrom +
                                        ' - ' +
                                        value.shiftTimingTo +
                                        ') '
                                    }`;
                                }
                            );
                        },
                        (error) => {
                            this.toastr.error('Error', error.message);
                        }
                    );
            },
            (error: any) => {
                this.toastr.error('Error', error.message);
            }
        );
    }

    initform() {
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
    }

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

    getFilterEvent(e: any) {
        this.submitted = true;
        if (e.event == 'true') {
            this.stopForm.markAllAsTouched();
            if (!this.stopForm.invalid) {
                if (this.isEdit == true) {
                    this.editSaveStop();
                } else {
                    this.saveStop();
                }
            }
        } else {
            this.displayFilter = false;
            this.stopForm.reset();
        }
    }

    changeInputProject(event: any) {
        this.inputProject = event.target.value;
    }

    Edit(val: any) {
        this.editRowID = val;
    }

    displayFn(country: Country): any {
        return country;
    }

    private _filter(name: string): Country[] {
        const filterValue = name.toLowerCase();

        return this.countryList.filter((option: any) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    selectedRecords(e: any, row: any): any {
        if (e.checked) {
            this.selectedModelIds.push(row['routeStopDetailId']);

            const allItemsEnabled = this.stopList?.every(
                (item: any) => item.enable === true
            );

            if (allItemsEnabled) {
                const index = this.unselectedStops.indexOf(
                    row['routeStopDetailId']
                );
                this.unselectedStops.splice(index, 1);
            }
        } else {
            const index = this.selectedModelIds.indexOf(
                row['routeStopDetailId']
            );

            const allItemsEnabled = this.stopList?.every(
                (item: any) => item.enable === true
            );
            if (allItemsEnabled) {
                this.unselectedStops.push(row['routeStopDetailId']);
            }
            this.selectedModelIds.splice(index, 1);
        }

        if (!row.enable) {
            e.preventDefault(); // Prevent clicking on a disabled checkbox
            return;
        }
        row.isOptimized = row.isOptimized === 1 ? 0 : 1;
    }

    // Function to determine if all checkboxes are selected
    isAllSelected() {
        if (this.stopList?.length > 0) {
            return this.stopList?.every((item: any) => item.isOptimized === 1);
        }
    }

    // Function to determine if all checkboxes should be disabled
    areAllDisabled() {
        if (this.stopList?.length > 0) {
            return this.stopList?.every((item: any) => !item.enable);
        }
    }

    masterToggle(): any {
        if (this.isAllSelected()) {
            this.selection.clear();

            const allItemsEnabled = this.stopList?.every(
                (item: any) => item.enable === true
            );

            this.stopList.forEach((row: any) => {
                const index = this.selectedModelIds.indexOf(
                    row['routeStopDetailId']
                );
                this.selectedModelIds.splice(index, 1);

                if (allItemsEnabled) {
                    this.unselectedStops.push(row['routeStopDetailId']);
                }
            });
        } else {
            this.unselectedStops = [];
            this.stopList.forEach((row: any) => {
                this.selection.select(row);
                this.selectedModelIds.push(row['routeStopDetailId']);
            });
        }

        const areAllSelected = this.isAllSelected();

        for (const item of this.stopList) {
            if (item.enable) {
                item.isOptimized = areAllSelected ? 0 : 1;
            }
        }
    }

    BindCountry() {
        this.subscriptions.push(
            this.stopService.countryDropdown().subscribe((data: any) => {
                if (data.code == 200) {
                    this.countryList = data;
                }
            })
        );
    }

    bindProjects() {
        this.subscriptions.push(
            this.stopService.projectList().subscribe(
                (data: any) => {
                    if (data.code == 200) {
                        this.projectList = data.data;
                        if (
                            !constantFunction.isEmpty(this.routeProjectDetailId)
                        ) {
                            if (!constantFunction.isEmpty(this.inputProject)) {
                                this.projectList.filter((x: any) => {
                                    if (x.name == this.inputProject) {
                                        this.selectedProjectData = x.name;
                                        sessionStorage.setItem(
                                            'selectedProject',
                                            x.routeDetailId
                                        );
                                        this.routeProjectDetailId =
                                            x.routeDetailId;
                                        this.inputProject = '';
                                    }
                                });
                                this.getStopList();
                            } else {
                                this.getStopList();
                                this.projectList.filter((x: any) => {
                                    if (
                                        x.routeDetailId ==
                                        this.routeProjectDetailId
                                    ) {
                                        return (this.selectedProjectData =
                                            x.name);
                                    }
                                });
                            }
                        } else if (
                            !constantFunction.isEmpty(this.inputProject)
                        ) {
                            this.projectList.filter((x: any) => {
                                if (x.name === this.inputProject) {
                                    this.selectedProjectData = x.name;
                                    sessionStorage.setItem(
                                        'selectedProject',
                                        x.routeDetailId
                                    );
                                    this.routeProjectDetailId = x.routeDetailId;
                                    this.inputProject = '';
                                }
                            });
                            this.getStopList();
                        }
                    }
                },
                (error: any) => {
                    this.toastr.error('Error', error.message);
                }
            )
        );
    }

    onProjectChange(event: any) {
        if (event === 'newProject') {
            this.showInput = true;
        } else {
            this.showInput = false;
        }
        this.selectedModelIds = [];
        this.selection.clear();
        let eventSelectedProject = event;

        this.projectList.filter((x: any) => {
            if (x.name == eventSelectedProject) {
                this.routeProjectDetailId = x.routeDetailId;
            }
        });

        if (!constantFunction.isEmpty(this.routeProjectDetailId)) {
            sessionStorage.setItem(
                'selectedProject',
                this.routeProjectDetailId
            );
            this.getStopList();
        }
    }

    addContarints() {
        const dialog = this.dialog.open(ConstarintsPopupComponent, {
            width: '60%',
            data: {
                // Your data goes here
                type: ['Assign Driver', 'Inter Dependent Stops'],
                routeProjectID: this.routeProjectDetailId,
            },
            autoFocus: false,
        });
        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
                this.assignedDrivers = result.data.driverId;
            } else if (result.event == 'cancel') {
            }
        });
    }

    /**
     * Set the paginator and sort after the view init since this component will
     * be able to query its view for the initialized paginator and sort.
     */

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (filterValue != '' && filterValue != null) {
            this.dataSource.filter = filterValue.trim().toLowerCase();
            if (this.dataSource.filteredData.length === 0) {
                //  this.dataSource = new MatTableDataSource();
                this.noDataDisplay = true;
            }
        } else {
            this.getStopList();
        }
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openDialog() {
        if (!constantFunction.isEmpty(this.inputProject)) {
            let data = {
                name: this.inputProject,
                routeDate: formatDate(new Date(), 'MM/dd/yyyy', 'en'),
            };

            this.subscriptions.push(
                this.stopService.saveProject(data).subscribe(
                    (successData: any) => {
                        if (successData.code == 200) {
                            this.bindProjects();
                            this.currentFolder = 'Add Stops';
                            this.isEdit = false;
                            this.displayFilter = true;
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error.message);
                    }
                )
            );
        } else {
            this.currentFolder = 'Add Stops';
            this.isEdit = false;
            this.displayFilter = true;
        }
    }
    openUploadDialog() {
        if (!constantFunction.isEmpty(this.inputProject)) {
            let data = {
                name: this.inputProject,
                routeDate: formatDate(new Date(), 'MM/dd/yyyy', 'en'),
            };
            this.subscriptions.push(
                this.stopService.saveProject(data).subscribe(
                    (successData: any) => {
                        if (successData.code == 200) {
                            this.bindProjects();
                            this.uploadDialog();
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error.message);
                    }
                )
            );
        } else {
            this.uploadDialog();
        }
    }

    uploadDialog() {
        const dialog = this.dialog.open<UploadDataPopupComponent, any>(
            UploadDataPopupComponent,
            {
                autoFocus: false,
                data: {
                    // Your data goes here
                    type: 'stopdetail',
                    routeProjectID: this.routeProjectDetailId,
                },
            }
        );

        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
                this.toastr.success('Success', 'File Uploaded Successfully');
                this.mappingDialog(result.data);
            } else if (result.event == 'cancel') {
                this.toastr.error('Cancelled', 'File is not uploaded');
            }
        });
    }

    // Call the optimize route api
    OptimizeRoute() {
        if (this.assignedDrivers.length > 0) {
            if (this.stopList.some((row: any) => row.enable === false)) {
                let userReq = {
                    routeDetailId: this.routeProjectDetailId,
                    routeStopDetailIds: this.selectedModelIds,
                    unselectedRouteStopDetailIds: [],
                };

                this.stopService.optimizeRouteAddstops(userReq).subscribe(
                    (successData: any) => {
                        if (successData) {
                            this.commonService.optimizeRouteDetails.next(
                                successData.data
                            );
                            this.router.navigate(['/home/suggested-route']);
                            this.commonService.headerTitle.next(
                                'Suggested Route'
                            );
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error.message);
                    }
                );
            } else {
                let userReq = {
                    routeDetailId: this.routeProjectDetailId,
                    routeStopDetailIds: this.selectedModelIds,
                };

                this.stopService.optimizeRoute(userReq).subscribe(
                    (successData: any) => {
                        if (successData) {
                            this.commonService.optimizeRouteDetails.next(
                                successData.data
                            );
                            this.router.navigate(['/home/suggested-route']);
                            this.commonService.headerTitle.next(
                                'Suggested Route'
                            );
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error.message);
                    }
                );
            }
        } else {
            this.toastr.error(
                ' Please assign at least one driver to this route '
            );
        }
    }

    // Map data after uploading the document
    mappingDialog(data: any) {
        const dialog = this.dialog.open(ColumnMappingComponent, {
            autoFocus: false,
            data: {
                // Your data goes here
                type: 'stopdetail',
                apiResponse: data,
                routeProjectID: this.routeProjectDetailId,
            },
        });

        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
                const userRequest = {
                    sysFileName: result.data.fileName,
                    parentId: this.routeProjectDetailId,
                };

                this.commonService
                    .importData(userRequest, result.data.sysType)
                    .subscribe(
                        (impData: any) => {
                            if (impData) {
                                this.getStopList();
                                this.toastr.success(
                                    'Success',
                                    'Data imported successfully'
                                );
                            }
                        },
                        (err) => {
                            this.toastr.error('Error', err.message);
                        }
                    );
            } else if (result.event == 'cancel') {
                this.toastr.error('Cancelled', 'Data not imported');
            }
        });
    }

    logout() {
        if (confirm('Are you Really wants to log Out???')) {
            this.auth.logOut();
        }
    }

    getStopList() {
        let selectedProjectId = this.routeProjectDetailId;
        this.subscriptions.push(
            this.stopService.getStopList(selectedProjectId).subscribe(
                (successData: any) => {
                    this.stopList = successData.data;
                    this.getAssignedDriverList();
                    if (
                        this.stopList.some((row: any) => row.enable === false)
                    ) {
                        this.stopList.forEach((row: any) => {
                            if (row.isOptimized === 1) row.enable = false;
                        });
                    }
                    this.selectedModelIds = [];

                    this.stopList.forEach((row: any) => {
                        if (row.isOptimized === 1) {
                            this.selection.select(row);
                            this.selectedModelIds.push(
                                row['routeStopDetailId']
                            );
                        }
                    });

                    this.dataSource = new MatTableDataSource(this.stopList);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                },
                (error: any) => {
                    this.toastr.error('Stop Details', error.message);
                }
            )
        );
    }

    // service call for Delete item from list
    deleteData(data: any) {
        const dialogRef = this.dialog.open(ConfirmPopupComponent, {
            data: {
                title: 'Delete',
                btn1: 'Delete',
                btn2: 'Cancel',
                message: 'Are you sure you want to delete this item?',
            },
        });

        //Callback method of popup close
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'Y') {
                let reqparam = {
                    routeStopDetailId: data.routeStopDetailId,
                    routeDetailId: data.routeDetailId,
                };

                this.stopService.deleteStops(reqparam).subscribe(
                    (successData: any) => {
                        if (successData.code == 200) {
                            this.toastr.success(
                                'Success',
                                'Record deleted successfully.'
                            );

                            this.getStopList();
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Delete stop', error.message);
                    }
                );
            }
        });
    }

    saveStop() {
        let objData = {
            routeDetailId: this.routeProjectDetailId,
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

        this.subscriptions.push(
            this.stopService.addStop(objData).subscribe(
                (successData: any) => {
                    if (successData) {
                        this.toastr.success(
                            'Success',
                            'Stop Added Successfully'
                        );
                        this.submitted = false;
                        this.stopForm.reset();
                        this.displayFilter = false;
                        this.inputProject = '';
                        this.getStopList();
                    }
                },
                (error: any) => {
                    this.toastr.error('Add stop', error.message);
                }
            )
        );
    }

    editStopData(data: any, actInfo?: any) {
        this.displayFilter = true;
        this.actInfo = actInfo === 'showInfoOnly' ? actInfo : '';
        this.isEdit = true;
        this.currentFolder = 'Edit Stop';

        this.subscriptions.push(
            this.stopService.getByIdStop(data).subscribe(
                (successData: any) => {
                    if (successData.code == 200) {
                        this.stopIdNo = successData.data.routeStopDetailId;
                        this.routeProjectDetailId =
                            successData.data.routeDetailId;
                        this.stopForm.patchValue(successData.data);
                        this.stopForm?.patchValue({
                            remark:
                                successData.data.remark == 'NA' ||
                                successData.data.remark == 'None' ||
                                successData.data.remark == 'No'
                                    ? ''
                                    : successData.data.remark,
                        });
                        this.countryList.filter((x: any) => {
                            if (x.countryId == data.countryId) {
                                this.stopForm?.patchValue({
                                    countryId: x.name,
                                });
                            }
                        });
                    }
                },
                (error: any) => {
                    this.toastr.error('Error', error.message);
                }
            )
        );
    }

    editSaveStop() {
        this.countryList.filter((x: any) => {
            if (x.name == this.stopForm.value.countryId) {
                this.stopForm?.patchValue({
                    countryId: x.countryId,
                });
            }
        });
        let objData = {
            routeStopDetailId: this.stopIdNo,
            routeDetailId: this.routeProjectDetailId,
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

        this.stopService.updateStop(objData).subscribe(
            (successData: any) => {
                if (successData.code == 200) {
                    this.isEdit = false;
                    this.toastr.success('Success', 'Stop Updated Successfully');
                    this.stopForm.reset();
                    this.displayFilter = false;
                    this.getStopList();
                }
            },
            (errorMessage) => {
                this.toastr.error('Edit stop', errorMessage.Message);
            }
        );
    }

    changParkingTime(row?: any, input?: any) {
        if (input.target.value) {
            let time = input.target.value;
            let data = {
                routeStopDetailId: row.routeStopDetailId,
                routeDetailId: row.routeDetailId,
                parkingTime: parseInt(time),
            };

            this.stopService.partkingTime(data).subscribe(
                (successData: any) => {
                    if (successData) {
                    }
                },
                (error: any) => {
                    this.toastr.error('Error', error.message);
                }
            );
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach((subscription: any) =>
            subscription.unsubscribe()
        );
    }
}
