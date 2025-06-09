import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    AgentTSATraining = '';
    AgentElevatedRisk = '';
    subscriptions: Subscription[] = [];
    menuSubscription: Subscription | undefined = undefined;
    FSLName = '';

    headerTitle: string = '';

    constructor(
        private commonServices: CommonService,
        private storageService: LocalStoreService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.commonServices.headerTitle.subscribe((value) => {
                if (value) {
                    this.headerTitle = value;
                }
            })
        );
        this.headerTitle = this.storageService.getItem('menu-name');
    }

    ngOnDestroy() {
        this.menuSubscription?.unsubscribe();
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
    backToHistory() {
        this.router.navigate(['/home/history']);
        this.commonServices.headerTitle.next('History');
    }
}
