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
import { DatePipe } from '@angular/common';
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
import { Router } from '@angular/router';

import { Observable, Subscription, map, startWith } from 'rxjs';
import { ConfirmPopupComponent } from 'src/app/shared/component/confirm-popup/confirm-popup.component';
import { DriverService } from '../../../shared/services/driver.service';
import { Country } from 'src/app/shared/model/country.model';
import { constantFunction } from 'src/app/shared/constants/constantFunction.constant';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';

// import * as CryptoJS from 'crypto-js';
@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss'],
    providers: [DatePipe],
})
export class DriversComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    submitted: boolean = false;
    projectList: any;
    isEdit: boolean = false;
    driverIdNo: any;
    hidePassword: boolean = true;
    countryList: any;
    filteredOptions: any = new Observable<Country[]>();
    noDataDisplay = false;
    fileArr: any = [];
    imgArr: any = [];
    fileObj: any = [];
    msg!: string;
    progress: number = 0;
    ErrorMsg: string = '';
    fileBase64: any;
    selectedFiles: any;
    size: any;
    statusMap: any = {};
    readonly range = new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
    });
    //hostlistner to close filter
    @HostListener('click', ['$event'])
    outSideClickFunction(event: any) {
        if (event.target.classList.value === 'row filter-wrapper') {
            this.displayFilter = false;
        }
    }
    projectForm!: FormGroup;
    // show the filter
    displayFilter = false;
    // send the input value
    currentFolder: string = 'Add Project';
    //filter tamplate
    @ViewChild('filter', { read: ViewContainerRef }) filter: any;
    displayedColumns = [
        'projectName',
        'createdDate',
        'totalStop',
        'totalBus',
        'status',
        'action',
    ];
    startDate: Date | null = null;
    endDate: Date | null = null;
    cardsData: any;
    isTimeoutEnabled = false; // Controls the visibility of the dropdown
    timeOutValues: number[] = [1, 2, 5]; // Sample timeout values
    // timeOutValues: any = [
    //     'Cheapest',
    //     'Response Time greater 1 min',
    //     'Response Time greater 2 min',
    //     'Response Time greater 3 min',
    // ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    encryptSecretKey = `2878IjiwtW7adnwfx5a9ENKxJ`;
    constructor(
        private auth: AuthService,
        private datepipe: DatePipe,
        public dialog: MatDialog,
        public router: Router,
        private fb: FormBuilder,
        public driverService: DriverService,
        private userService: UserService,
        private commonService: CommonService,
        private toastr: ToastrService
    ) {
        this.initform();
    }

    ngOnInit(): void {
        // Listen for checkbox changes and enable/disable timeout select
        this.projectForm
            .get('isTimeoutEnabled')
            ?.valueChanges.subscribe((isChecked) => {
                if (isChecked) {
                    this.projectForm.get('timeOut')?.enable();
                    this.projectForm
                        .get('timeOut')
                        ?.setValidators(Validators.required);
                } else {
                    this.projectForm.get('timeOut')?.reset();
                    this.projectForm.get('timeOut')?.clearValidators();
                    this.projectForm.get('timeOut')?.disable();
                }
                this.projectForm.get('timeOut')?.updateValueAndValidity();
            });
        this.getProjectList();
    }
    onTimeoutEnabledChange(): void {
        this.updateTimeoutValidators();

        // If the checkbox is unchecked, patch the timeout value to 60
        if (!this.projectForm.get('isTimeoutEnabled')?.value) {
            this.projectForm.patchValue({
                timeOut: 60,
            });
        }
    }

    onInputChange(event: any) {
        const inputValue = event.target.value;

        if (inputValue.length > 4) {
            event.target.value = inputValue.substr(0, 4); // Truncate the input to 4 characters
        }
    }

    initform(): any {
        this.projectForm = this.fb.group({
            projectName: ['', Validators.required],
            timeOut: ['', Validators.required],
            file: [null, Validators.required],
            isTimeoutEnabled: [false],
        });
        // Initially, disable the timeOut validation
        this.updateTimeoutValidators();
    }

    // Update the timeout validators dynamically based on the checkbox
    private updateTimeoutValidators(): void {
        const timeOutControl = this.projectForm.get('timeOut');
        const isTimeoutEnabled =
            this.projectForm.get('isTimeoutEnabled')?.value;

        if (isTimeoutEnabled) {
            timeOutControl?.setValidators([Validators.required]);
        } else {
            timeOutControl?.clearValidators();
        }
        timeOutControl?.updateValueAndValidity();
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

    applyDateFilter() {
        if (!this.startDate || !this.endDate) {
            this.dataSource.data = this.projectList?.project_list; // Reset to original data
            return;
        }

        // Convert and normalize start & end dates
        const startDateUTC = new Date(this.startDate);
        startDateUTC.setHours(0, 0, 0, 0); // Start of the day

        const endDateUTC = new Date(this.endDate);
        endDateUTC.setHours(23, 59, 59, 999); // End of the day

        console.log('Formatted Start Date:', startDateUTC);
        console.log('Formatted End Date:', endDateUTC);

        const filteredData = this.projectList?.project_list.filter(
            (item: any) => {
                const itemDate = new Date(item.time);
                itemDate.setHours(0, 0, 0, 0); // Normalize item date to remove time zone shifts

                console.log('Item Date:', itemDate);

                return itemDate >= startDateUTC && itemDate <= endDateUTC;
            }
        );

        this.dataSource.data = filteredData;
    }

    // Select file and check if it is json or csv
    upload(event: any): void {
        this.ErrorMsg = '';
        const file: File = event.target.files[0];
        this.selectedFiles = file;
        this.size = Math.ceil(file.size / 1024);

        if (file) {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
                const fileType: string = file.type;

                if (
                    fileType ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    // Convert xlsx file content to Base64
                    const base64String = e.target.result.split(',')[1]; // Extract Base64 part
                    this.fileBase64 = base64String; // Store Base64 string
                } else {
                    this.ErrorMsg = 'Only XLSX files are allowed.';
                    this.projectForm.controls['file'].setValue(null); // Reset the form control
                }
            };

            // Read the xlsx file as a Base64 encoded string
            reader.readAsDataURL(file);
        }
    }

    checkDates(projectForm: FormGroup) {
        let shiftTimingFrom = projectForm?.value.shiftTimingFrom;
        let shiftTimingTo = projectForm?.value.shiftTimingTo;
        if (
            !constantFunction.isEmpty(shiftTimingFrom) &&
            !constantFunction.isEmpty(shiftTimingTo)
        ) {
            if (shiftTimingFrom > shiftTimingTo) {
                return { notValid: true };
            }
        }
        let breakTimeFrom = projectForm?.value.breakTimeFrom;
        let breakTimeTo = projectForm?.value.breakTimeTo;
        if (
            !constantFunction.isEmpty(breakTimeFrom) &&
            !constantFunction.isEmpty(breakTimeTo)
        ) {
            if (breakTimeFrom > breakTimeTo) {
                return { notBreackValid: true };
            }
        }

        return null;
    }
    public togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
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

        // Check if filter value is non-empty
        if (filterValue !== '' && filterValue !== null) {
            this.dataSource.filter = filterValue.trim().toLowerCase();

            // Check if the filtered data is empty
            if (this.dataSource.filteredData.length === 0) {
                this.noDataDisplay = true; // Show "no data" message
            } else {
                this.noDataDisplay = false; // Hide "no data" message when data is found
            }
        } else {
            // Reset the data source to original list when filter is cleared
            this.dataSource = new MatTableDataSource(
                this.projectList?.project_list
            );
            this.noDataDisplay = false; // Hide "no data" message when filter is cleared
        }
        this.dataSource.paginator = this.paginator;
        // Ensure paginator starts from the first page
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openDialog() {
        this.currentFolder = 'Add Project';
        this.isEdit = false;
        this.displayFilter = true;
    }

    // Upload document of drivers
    uploadDialog() {
        const dialog = this.dialog.open(UploadDataPopupComponent, {
            autoFocus: false,
            data: {
                // Your data goes here
                type: 'driverdetail',
            },
        });

        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
                this.toastr.success('Success', 'File Uploaded Successfully');
                this.mappingDialog(result.data);
            } else if (result.event == 'cancel') {
                this.toastr.error('Cancelled', 'File is not uploaded');
            }
        });
    }

    // Map data after uploading the document
    mappingDialog(data: any) {
        const dialog = this.dialog.open(ColumnMappingComponent, {
            autoFocus: false,
            data: {
                // Your data goes here
                type: 'driverdetail',
                apiResponse: data,
            },
        });

        dialog.afterClosed().subscribe((result: any) => {
            if (result.event == 'success') {
                const userRequest = {
                    sysFileName: result.data.fileName,
                    parentId: 0,
                };

                this.commonService
                    .importData(userRequest, result.data.sysType)
                    .subscribe(
                        (impData: any) => {
                            if (impData) {
                                this.getProjectList();
                                this.toastr.success(
                                    'Success',
                                    'Data imported successfully'
                                );
                            }
                        },
                        (err) => {
                            this.toastr.error('Import Data', err.message);
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

    getFilterEvent(e: any) {
        if (e.event == 'true') {
            this.projectForm.markAllAsTouched();

            if (!this.projectForm.invalid) {
                this.saveProject();
            }
        } else {
            this.displayFilter = false;
            this.projectForm.reset();
        }
    }

    getProjectList() {
        let req = {
            jwt_token: this.auth.getToken(),
        };

        this.subscriptions.push(
            this.driverService.getProjectList(req).subscribe(
                (successData: any) => {
                    if (successData) {
                        this.projectList = successData;
                        setTimeout(() => {
                            this.dataSource = new MatTableDataSource(
                                this.projectList?.project_list
                            );

                            // Loop through each project and call checkStatus if config_data is missing or empty
                            this.projectList?.project_list.forEach(
                                (project: any) => {
                                    // Check if config_data is not defined, is null, or is an empty object/array/string
                                    if (project.npickstudents == 0) {
                                        this.checkStatus(project, project.id); // Call checkStatus for missing or empty config_data
                                        this.statusMap[project.id] = 'loading'; // Set status to 'loading' if config_data is missing
                                    } else {
                                        // If config_data exists, update the status to 'done'
                                        this.statusMap[project.id] = 'done';
                                    }
                                }
                            );

                            this.cardsData = successData?.aggregate_metrics;
                            this.dataSource.paginator = this.paginator;
                        }, 30);
                    }
                },
                (error: any) => {
                    this.toastr.error(error.detail, 'Error!');
                }
            )
        );
    }

    BindCountry() {
        this.subscriptions.push(
            this.driverService.countryDropdown().subscribe((data: any) => {
                if (data) {
                    this.countryList = data;
                }
            })
        );
    }

    // service call for Delete iteam from list
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
                let reqparam = data;
                this.driverService.deleteDriver(reqparam).subscribe(
                    (successData: any) => {
                        this.toastr.success(
                            'Success',
                            'Record deleted successfully.'
                        );
                        if (successData.code == 200) {
                            this.getProjectList();
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Add driver', error.message);
                    }
                );
            }
        });
    }

    saveProject() {
        let req = {
            project_name: this.projectForm.value.projectName,
            search_mode:
                this.projectForm.value.isTimeoutEnabled == false ? 0 : 2,
            timeout_seconds: this.projectForm.value.timeOut
                ? this.projectForm.value.timeOut * 60 // Assuming the timeOut is in minutes and converting to seconds
                : 60, // Default value of 60 seconds if timeOut is not provided

            jwt_token: this.auth.getToken(),
            excel_base64: this.fileBase64,
        };
        this.subscriptions.push(
            this.driverService.addProject(req).subscribe(
                (successData: any) => {
                    if (successData) {
                        this.toastr.success(
                            'Success',
                            'Project Added Successfully'
                        );
                        this.getProjectList();

                        this.submitted = false;
                        this.displayFilter = false;
                        this.projectForm.reset();
                        // this.getProjectList();
                    }
                },
                (error: any) => {
                    console.log(error);

                    this.toastr.error('Add Project', error.detail);
                }
            )
        );
    }
    checkStatus(data: any, rowId: string) {
        const interval = 5000; // 5 seconds retry interval
        const maxTimeout = 15 * 60 * 1000; // 15 minutes in milliseconds
        let req = {
            project_id: data.id.toString(),
        };

        this.statusMap[rowId] = 'loading'; // Set initial loading state
        let isListApiCalled = false; // Flag to ensure `getProjectList` is called only once
        let startTime = Date.now(); // Track start time

        const fetchData = () => {
            // Check if max timeout is reached
            if (Date.now() - startTime >= maxTimeout) {
                this.statusMap[rowId] = 'error'; // Mark as error
                this.toastr.error(
                    'Timeout',
                    'Request timed out after 15 minutes.'
                );
                return; // Stop retrying
            }

            const subscription = this.driverService
                .projectStatus(req)
                .subscribe(
                    (successData: any) => {
                        if (
                            successData &&
                            successData.project_row.response_data?.length > 0
                        ) {
                            this.statusMap[rowId] = 'done'; // Update status to done

                            // Call the getProjectList API only once if it hasn't been called yet
                            if (!isListApiCalled) {
                                this.getProjectList(); // Trigger the list API to refresh data
                                isListApiCalled = true; // Set flag to true to prevent further calls
                            }
                        } else {
                            setTimeout(fetchData, interval); // Retry if no data received
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error.message);
                        this.statusMap[rowId] = 'error'; // Optional: Handle error state
                    }
                );

            this.subscriptions.push(subscription);
        };

        fetchData();
    }

    editSaveDriver() {
        let objData = {
            driverDetailId: this.driverIdNo,
            projectName: this.projectForm.value.projectName,
            lastName: this.projectForm.value.lastName,
            address: this.projectForm.value.address,
            altContactNo: this.projectForm.value.altContactNo,
            breakTimeFrom: this.projectForm.value.breakTimeFrom,
            breakTimeTo: this.projectForm.value.breakTimeTo,
            contactNo: this.projectForm.value.contactNo,
            email: this.projectForm.value.email,
            shiftTimingFrom: this.projectForm.value.shiftTimingFrom,
            shiftTimingTo: this.projectForm.value.shiftTimingTo,
            remark: this.projectForm.value.remark,
            countryId: this.projectForm.value.countryId,
            city: this.projectForm.value.city,
            state: this.projectForm.value.state,
            zipCode: this.projectForm.value.zipCode,
            password: this.projectForm.value.password,
        };

        this.driverService.updateDriver(objData).subscribe(
            (successData: any) => {
                if (successData.code == 200) {
                    this.isEdit = false;
                    this.toastr.success(
                        'Success',
                        'Driver Updated Successfully'
                    );
                    this.submitted = false;
                    this.displayFilter = false;
                    this.projectForm.reset();
                    this.getProjectList();
                }
            },
            (error) => {
                this.toastr.error('Update driver', error.message);
            }
        );
    }

    gotoDetails(data: any) {
        this.router.navigate(['/home/track'], { queryParams: { id: data.id } });
    }
    downloadAllFiles(data: any) {
        const fileNames = data.excel_name_list; // File names
        const base64Data = data.excel_b64_list; // Base64 file data

        if (fileNames.length !== base64Data.length) {
            return;
        }

        fileNames.forEach((fileName: string, index: number) => {
            this.downloadFile(base64Data[index], fileName);
        });
    }

    downloadFile(base64Data: string, fileName: string) {
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

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: any) =>
            subscription.unsubscribe()
        );
    }
}
