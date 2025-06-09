import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { CommonService } from './shared/services/common.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'routeOptimization';
    apiLoaded!: boolean;
    /**
     * for show/hide progress bar
     */
    isShowProgress: boolean;

    constructor(
        httpClient: HttpClient,
        private commonSerivice: CommonService,
        private cdr: ChangeDetectorRef,
        private http: HttpClient
    ) {
        this.isShowProgress = false;

        httpClient
            .jsonp(
                'https://maps.googleapis.com/maps/api/js?key=AIzaSyBZQAT8BgeRXe3ke1gRL9gnHabHLI3TAI8',
                'callback'
            )
            .pipe(
                map(() => true),
                catchError(() => of(false))
            )
            .subscribe((loaded) => {
                this.commonSerivice.currentApiStatus.next(loaded);
            });
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        /**
         * For Progress bar
         */
        this.commonSerivice.isLoading.subscribe((res: boolean) => {
            this.isShowProgress = res;
            this.cdr.detectChanges();
        });
    }
}
