import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
    selector: 'app-mainlayout',
    templateUrl: './mainlayout.component.html',
    styleUrls: ['./mainlayout.component.css'],
})
export class MainlayoutComponent {
    /**
     * for show/hide progress bar
     */
    // isShowProgress: boolean;

    constructor(private router: Router, private commonService: CommonService) {
        // this.isShowProgress = false;
    }

    ngOnInit(): void {
        /**
         * For Progress bar
         */
        // this.commonService.isLoading.subscribe((res: boolean) => {
        //     console.log(res);
        //     this.isShowProgress = res;
        // });
    }
}
