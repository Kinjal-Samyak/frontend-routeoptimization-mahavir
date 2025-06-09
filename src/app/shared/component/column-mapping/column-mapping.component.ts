import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-column-mapping',
    templateUrl: './column-mapping.component.html',
    styleUrls: ['./column-mapping.component.scss'],
})
export class ColumnMappingComponent implements OnInit {
    type!: string;
    columnList!: any;
    columnMapFrm!: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public matData: any,
        public fb: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.columnMapFrm = this.fb.group({});

        this.type = this.matData.type;

        if (this.type === 'driverdetail') {
            this.commonService.getMapColumnData(this.type).subscribe(
                (mapColumnSuccess: any) => {
                    this.getColumnList(mapColumnSuccess.data);
                },
                (error: any) => {
                    this.toastr.error('Column List', error.message);
                }
            );
        } else if (this.type === 'stopdetail') {
            this.commonService.getMapColumnData(this.type).subscribe(
                (MapColumnData: any) => {
                    this.getColumnList(MapColumnData.data);
                },
                (error: any) => {
                    this.toastr.error('Column List', error.message);
                }
            );
        }
    }
    onNoClick() {
        this.dialogRef.close({ event: 'cancel' });
    }

    getColumnList(value: any) {
        this.columnList = value;

        for (let i = 0; i < this.columnList.length; i++) {
            this.columnMapFrm.addControl(
                this.columnList[i].columnName,
                this.fb.control('')
            );

            this.columnMapFrm.controls[
                this.columnList[i].columnName
            ].patchValue(this.columnList[i].fileHeaderName);
        }
    }

    CloseClick(): void {
        this.dialogRef.close({ event: 'cancel' });
    }

    counter(i: number) {
        return new Array(i);
    }

    save() {
        this.columnMapFrm.markAllAsTouched();
        if (this.columnMapFrm.valid) {
            for (const [inputKey, inputValue] of Object.entries(
                this.columnMapFrm.value
            )) {
                this.columnList.forEach((value: any, index: number) => {
                    if (value.columnName === inputKey) {
                        value.fileHeaderName = inputValue || '';
                    }
                });
            }
            this.commonService
                .PostMapColumnData(this.columnList, this.type)
                .subscribe(
                    (data: any) => {
                        if (data) {
                            this.toastr.success(
                                'Success',
                                'Column mapped successfull'
                            );
                            this.dialogRef.close({
                                event: 'success',
                                data: {
                                    fileName: this.matData.apiResponse,
                                    sysType: this.type,
                                },
                            });
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Map Column', error.message);
                    }
                );
        }
    }
}
