import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
} from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { DriverService } from '../../services/driver.service';
import { StopService } from '../../services/stop.service';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-constarints-popup',
    templateUrl: './constarints-popup.component.html',
    styleUrls: ['./constarints-popup.component.scss'],
})
export class ConstarintsPopupComponent implements OnInit {
    // Add new from control
    type = new FormControl('', Validators.required);

    // Check  from where the data is coming
    contentType: any;

    // All assigned drivers form control
    assignedDrivers: any = [];

    // assigning all stops details
    assignedStops: any;

    // Material table data
    dataSource: any;

    // Show the coloumns of the mat-table
    displayedColumns: any;

    // // Define the Reactive form gourp
    // constraintsFromArray: FormArray;

    adressList: Array<any> = ['Ahmedabad', 'Surat'];
    driverList: Array<any> = [];

    // Select attribute of the mat-select
    @ViewChild('select') select: MatSelect | any;

    // Select all the check boxes
    allSelected = false;

    // Reactive form gourp
    reactiveForm: FormGroup;

    // The type of the current selection
    currentType = '';

    // Id of the selected route project
    routeDetailId: any;

    @ViewChild(MatTable) table!: MatTable<any>;

    InterDependentFromStops: any;
    InterDependentToStops: any;
    defaultSelectedID: any;

    driverForm = new FormControl('');
    // shiftForm: new FormControl('', Validators.required);

    selectedDriver: any = [];
    deletedAssignedStops: any = [];

    constructor(
        public dialog: MatDialogRef<ConstarintsPopupComponent>,
        public dialogRef: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private driverService: DriverService,
        private stopService: StopService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService
    ) {
        // this.reactiveFormArray.push(this.reactiveForm);
        this.reactiveForm = this.fb.group({
            constraintsFromArray: this.fb.array([]),
        });
        if (data) {
            this.routeDetailId = data.routeProjectID;
            this.contentType = data.contentType;
        }
    }

    get constraintsArray(): FormArray {
        return this.reactiveForm.get('constraintsFromArray') as FormArray;
    }

    ngOnInit(): void {}

    // Delete row from the mat-table
    deleteRow(data: any, i: number) {
        console.log(data);
        this.assignedStops.filter((value: any, index: any) => {
            if (i === index) {
                this.deletedAssignedStops.push(
                    value.routeStopDependencyDetailId
                );
            }
            if (
                data.value.fromAddress === value.fromRouteStopDetailId &&
                data.value.toAddress === value.toRouteStopDetailId
            ) {
                this.assignedStops.splice(i, 1);
            }
        });
        const delectPopup = this.dialogRef.open(ConfirmPopupComponent, {
            data: {
                title: 'Delete',
                btn1: 'Delete',
                btn2: 'Cancel',
                message: 'Are you sure you want to delete this address?',
            },
        });
        delectPopup.afterClosed().subscribe((result: any) => {
            if (result === 'Y') {
                this.constraintsArray.removeAt(i);
                this.table.renderRows();
                this.toastr.success('Record deleted successfully', 'Success');
            } else {
                this.toastr.error('Record is not deleted', 'Cancelled');
            }
        });
    }

    // Close the popup
    closeDialog() {
        this.dialog.close({ event: 'cancel' });
    }

    // Save the data when user click on save button
    shareData() {
        if (this.type.valid) {
            const dependencyDetailsArray: any = [];

            this.constraintsArray.value.filter((value: any, index: any) => {
                let assignStop;

                if (
                    this.assignedStops?.length > 0 &&
                    this.assignedStops[index]?.routeStopDependencyDetailId
                ) {
                    assignStop =
                        this.assignedStops[index].routeStopDependencyDetailId;
                } else {
                    assignStop = 0;
                }

                const newObj = {
                    routeStopDependencyDetailId: assignStop,
                    fromRouteStopDetailId: value.fromAddress,
                    toRouteStopDetailId: value.toAddress,
                };

                dependencyDetailsArray.push(newObj);
            });

            const userReq = {
                routeDetailId: this.routeDetailId,
                dependencyDetails: dependencyDetailsArray,
                deletedStopDependencyIds: this.deletedAssignedStops,
            };

            this.stopService.postInterDependencyStops(userReq).subscribe(
                (Data: any) => {
                    if (Data) {
                        this.toastr.success('Success', 'Updated Successfully');
                        this.dialog.close({ event: 'success' });
                    }
                },
                (error: any) => {
                    this.toastr.error('Error', error.message);
                    this.dialog.close({ event: 'cancle' });
                }
            );
        } else {
            this.type.markAsTouched();
        }
    }

    // Call the optiize route api
    optimize() {
        this.dialog.close({ event: 'success' });
    }

    // calling post assigned driver api
    RouteData() {
        if (this.type.valid) {
            // this.dialog.close();
            const getAlltId = this.defaultSelectedID.map((value: any) => {
                return value.driverDetailId;
            });

            const userReq = {
                routeDetailId: this.routeDetailId,
                selectedDriverIds: getAlltId,
                assignedDrivers: this.assignedDrivers,
            };

            this.stopService.postAssignedDriverList(userReq).subscribe(
                (successData: any) => {
                    if (successData) {
                        this.toastr.success('Success', 'Updated Successfully');
                        this.dialog.close({
                            event: 'success',
                            data: {
                                driverId: this.defaultSelectedID.map(
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
                                ),
                            },
                        });
                    }
                },
                (error) => {
                    this.toastr.error('Error', error.message);
                }
            );
        }
    }
    // Change the mat-table columns
    selctChange(value: any) {
        this.displayedColumns =
            value === 'Assign Driver'
                ? ['Driver List']
                : ['From Address', 'To Address'];

        if (value === 'Assign Driver') {
            this.currentType = 'assignDriver';

            this.driverService.getDriversList().subscribe(
                (successData: any) => {
                    this.driverList = successData.data;

                    this.stopService
                        .getAssignedDriverList(this.routeDetailId)
                        .subscribe(
                            (successData: any) => {
                                this.dataSource = [1];
                                this.assignedDrivers = successData.data;

                                // Extract the driverDetailIds from successData
                                const routeDriverDetailIds =
                                    successData.data.map(
                                        (route: any) => route.driverDetailId
                                    );

                                // Filter the driverList array based on the matching driverDetailIds
                                const matchedDrivers = this.driverList.filter(
                                    (driver: any) =>
                                        routeDriverDetailIds.includes(
                                            driver.driverDetailId
                                        )
                                );

                                this.defaultSelectedID = matchedDrivers;

                                // Extract the first names of matched drivers
                                const matchedDriverFirstNames =
                                    matchedDrivers.map(
                                        (driver: any) => driver.driverDetailId
                                    );

                                this.driverForm.reset();
                                this.driverForm.setValue(
                                    matchedDriverFirstNames
                                );
                                this.cdr.detectChanges();
                                this.driverForm.updateValueAndValidity();
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
        } else if (value === 'Inter Dependent Stops') {
            this.currentType = 'InterDependentStops';
            this.dataSource = [];
            this.reactiveForm.reset();

            // Calling api to get from address list
            this.stopService
                .getInterDependentStopsList(this.routeDetailId, 'from')
                .subscribe(
                    (successData: any) => {
                        successData.data.filter((val: any) => {
                            val.fromRouteStopDetailId = val.routeStopDetailId;
                        });
                        this.InterDependentFromStops = successData.data;
                    },
                    (error) => {
                        this.toastr.error('Error', error.message);
                    }
                );

            // Calling api to get to address list
            this.stopService
                .getInterDependentStopsList(this.routeDetailId, 'To')
                .subscribe(
                    (successData: any) => {
                        successData.data.filter((val: any) => {
                            val.toRouteStopDetailId = val.routeStopDetailId;
                        });
                        this.InterDependentToStops = successData.data;
                        this.getSelectedInterdependentStops();
                    },
                    (error) => {
                        this.toastr.error('Error', error.message);
                    }
                );
        }
    }

    // function to show the selected address
    getSelectedInterdependentStops() {
        this.stopService
            .getSelectedInterDependentStops(this.routeDetailId)
            .subscribe(
                (successData: any) => {
                    if (successData.data.length > 0) {
                        this.reactiveForm.reset(); // Reset the form to its initial state
                        this.dataSource = [];
                        this.constraintsArray.clear();

                        this.assignedStops = successData.data;

                        // Assign value to the form controls
                        successData.data.filter((value: any) => {
                            let newFormGroup = this.fb.group({});
                            newFormGroup.addControl(
                                'fromAddress',
                                this.fb.control(value.fromRouteStopDetailId)
                            );
                            newFormGroup.addControl(
                                'toAddress',
                                this.fb.control(value.toRouteStopDetailId)
                            );

                            if (
                                value.fromRouteStopEnable === false ||
                                value.toRouteStopEnable === false
                            ) {
                                // To disable the controls in the newFormGroup
                                newFormGroup.disable();
                            }

                            this.constraintsArray.push(newFormGroup);
                        });
                        this.dataSource = this.constraintsArray.controls;
                        this.table.renderRows();
                    } else {
                        this.constraintsArray.clear();
                        this.createForms();
                    }
                },
                (error) => {
                    this.createForms();
                    this.toastr.error('Error', error.message);
                }
            );
    }

    createForms() {
        let newFormGroup = this.fb.group({});
        newFormGroup.addControl('fromAddress', this.fb.control(''));
        newFormGroup.addControl('toAddress', this.fb.control(''));
        this.constraintsArray.push(newFormGroup);
        this.dataSource = this.constraintsArray.controls;
        this.table.renderRows();
    }

    toggleAllSelection() {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => item.select());
            this.defaultSelectedID = this.driverList;
        } else {
            this.defaultSelectedID = [];
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClick(driverData: any) {
        const includedDriver = this.defaultSelectedID.indexOf(driverData);
        if (includedDriver !== -1) {
            this.defaultSelectedID.splice(includedDriver, 1);
        } else {
            this.defaultSelectedID.push(driverData);
        }

        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }

    // Add the row into mat-table
    addRow() {
        this.createForms();
    }

    nextData() {
        this.currentType = 'assignDriver';
        this.data.type.push('Assign Driver');
        this.displayedColumns = ['Driver List', 'Shift Time'];
        this.type.setValue('Assign Driver');
    }
}
