import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-upload-data-popup',
    templateUrl: './upload-data-popup.component.html',
    styleUrls: ['./upload-data-popup.component.scss'],
})
export class UploadDataPopupComponent implements OnInit {
    fileArr: any = [];
    imgArr: any = [];
    fileObj: any = [];
    form: FormGroup;
    msg!: string;
    progress: number = 0;
    ErrorMsg: string = '';
    resultData: any;
    selectedFiles: any;
    size: any;

    // define the type
    UploadTypeData: any;
    routeId: any;
    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private commonService: CommonService
    ) {
        this.form = this.fb.group({
            file: [null],
        });

        // this.routeId = data?.routeProjectDetailId;
        this.UploadTypeData = data?.type;
    }

    ngOnInit() {}

    // Select file and check if it is json or csv
    upload(event: any) {
        this.ErrorMsg = '';
        const file: File = event.target.files[0];
        this.selectedFiles = event.target.files;
        this.size = Math.ceil(file.size / 1024);

        if (file) {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
                const contents: string = e.target.result;
                const fileType: string = file.type;

                if (fileType === 'application/json') {
                    // Handle JSON file
                    this.resultData = contents;
                } else if (fileType === 'text/csv') {
                    // Handle CSV file
                    this.resultData = file;
                } else {
                    this.ErrorMsg = 'Only CSV file Allowed.';
                    this.form.controls['file'].setValue(null);
                }
            };

            reader.readAsText(file);
        }
    }

    // Clean Url
    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    // Cancel and close the dialoge box
    onNoClick(): void {
        this.dialogRef.close({ event: 'cancel' });
    }

    // Convert csv file
    csvFileDataGet(files: any) {
        if (files) {
            Papa.parse(files[0], {
                header: true,
                skipEmptyLines: true,
                complete: (result: any, file: any) => {
                    this.resultData = result.data;
                },
            });
        }
    }

    excelFileDataGet(files: any) {
        let workBook: any = null;
        let jsonData: any = null;
        const reader = new FileReader();
        const file = files[0];
        reader.onload = (event) => {
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            this.resultData =
                jsonData && typeof jsonData.Sheet1 != undefined
                    ? jsonData.Sheet1
                    : [];
        };
        reader.readAsBinaryString(file);
    }

    cancle() {
        this.ErrorMsg = '';
    }
    jsonFileDataGet(event: any) {
        let selectedFiles = event[0];
        const fileReader: any = new FileReader();
        fileReader.readAsText(selectedFiles);

        fileReader.onload = () => {
            this.resultData = JSON.parse(fileReader.result);
        };
        fileReader.onerror = (error: any) => {
            console.log(error);
        };
    }

    emmitData() {
        if (!this.resultData) {
            this.ErrorMsg = 'Please select the file';
        } else if (this.resultData) {
            const formData = new FormData();
            formData.append('file', this.resultData); // Append the file to FormData

            this.commonService
                .uploadDoc(formData, this.UploadTypeData)
                .subscribe(
                    (successData: any) => {
                        if (successData) {
                            this.dialogRef.close({
                                event: 'success',
                                data: successData.data,
                            });
                        } else {
                            this.dialogRef.close({
                                event: 'error',
                            });
                        }
                    },
                    (error: any) => {
                        this.dialogRef.close({
                            event: 'error',
                        });
                    }
                );
        }
    }
}
