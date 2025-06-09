import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HistoryService } from 'src/app/shared/services/history.service';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
    @Input() childData: any;
    // Subscription array
    subscriptions: Subscription[] = [];
    // Document details
    documentDetails: any = [];

    // Details of the document
    fileDetails: any;

    constructor(
        private historyService: HistoryService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        if (this.childData) {
            this.documentDetails = this.childData.stops.map((value: any) => {
                return value.documents;
            });
            console.log(this.documentDetails);
        }
    }

    // Download file of stops details
    downloadFile(document: any) {
        let userReq = {
            driverDetailId: this.childData.driverDetailId,
            routeName: this.childData.routeName,
            routeDate: this.childData.routeDate,
            systemFileName: document.systemFileName,
        };

        this.subscriptions.push(
            this.historyService
                .getDocument(userReq)
                .subscribe((successData: any) => {
                    if (successData.code == 200) {
                        this.fileDetails = successData.data;
                        this.saveFile(document.systemFileName);
                    }
                })
        );
    }
    saveFile(fileName: any) {
        const byteCharacters = atob(this.fileDetails);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
            type: 'application/pdf',
        });

        const url = window.URL.createObjectURL(blob);
        console.log('url', url);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}
