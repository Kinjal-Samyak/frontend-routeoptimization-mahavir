/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    // Define the screen name
    screenName: any;

    isProduction = false;
    env = environment;
    subscriptions: Subscription[] = [];
    constructor(
        private commonService: CommonService,
        private storageService: LocalStoreService,
        private router: Router,
        private auth: AuthService,
        private toastr: ToastrService
    ) {}

    // Information of the routes and the display the header
    routeInformation: Array<any> = [];

    ngOnInit(): void {
        let getIndex = this.storageService.getItem('menu-name');

        if (this.router.url) {
            // Information of the routes and the display the header
            this.routeInformation = [
                { name: 'Project Management', urls: '/home' },
                //{ name: 'Live Tracking', urls: '/home/track' },
                // {
                //     name: 'Stops (Delivery) Management',
                //     urls: '/home/stops',
                // },
                // { name: 'Suggested Route', urls: '/home/suggested-route' },
                // { name: 'History', urls: '/home/history' },
                // { name: 'Live Tracking', urls: '/home/live-tracking' },
            ];

            this.routeInformation.filter((route) => {
                if (route.name === getIndex) {
                    route.clicked = true;
                }
            });

            this.routeInformation.map((e) => {
                if (e.urls === this.router.url) {
                    this.screenName = e.name;
                }
            });
            this.routeToPages(this.screenName);
        }

        this.updateUrl();
    }

    updateUrl() {
        this.subscriptions.push(
            this.commonService.headerTitle.subscribe((value) => {
                if (value) {
                    this.routeInformation.filter((route) => {
                        route.clicked = false;
                    });
                    this.storageService.removeItem('menu-name');

                    this.storageService.setItem('menu-name', value);
                    let getIndex = this.storageService.getItem('menu-name');
                    this.routeInformation.filter((route) => {
                        if (route.name === getIndex) {
                            route.clicked = true;
                        }
                    });
                }
            })
        );
    }

    // Share data to header component
    routeToPages(eventName: string) {
        this.routeInformation.filter((route) => {
            route.clicked = false;
        });
        this.storageService.removeItem('menu-name');
        this.commonService.headerTitle.next(eventName);
        this.storageService.setItem('menu-name', eventName);
        let getIndex = this.storageService.getItem('menu-name');
        this.routeInformation.filter((route) => {
            if (route.name === getIndex) {
                route.clicked = true;
            }
        });
    }

    logOut() {
        this.subscriptions.push(
            this.auth.logOut().subscribe(
                (response: any) => {
                    this.toastr.success(
                        'Success',
                        'User Loggedout successfully'
                    );
                    localStorage.clear();
                    sessionStorage.clear();
                    this.router.navigate(['/login']).then(() => {
                        setTimeout(() => window.location.reload(), 500); // 👈 optional: allow cleanup before reload
                    });
                },
                (error) => {
                    this.toastr.error('Error', 'Something went wrong');
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
}
