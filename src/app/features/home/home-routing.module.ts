import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainlayoutComponent } from 'src/app/core/layout/mainlayout.component';
import { TrackingScreenComponent } from '../tracking-screen/tracking-screen.component';
import { LiveTrackingComponent } from '../live-tracking/live-tracking.component';

const routes: Routes = [
    {
        path: '',
        component: MainlayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('src/app/features/driver/driver.module').then(
                        (m) => m.DriverModule
                    ),
            },
            {
                path: 'track',
                component: LiveTrackingComponent,
            },
            // {
            //     path: 'stops',
            //     loadChildren: () =>
            //         import('src/app/features/stops/stops.module').then(
            //             (m) => m.StopsModule
            //         ),
            // },
            // {
            //     path: 'suggested-route',
            //     component: TrackingScreenComponent,
            // },

            // {
            //     path: 'history',
            //     loadChildren: () =>
            //         import('src/app/features/history/history.module').then(
            //             (m) => m.HistoryModule
            //         ),
            // },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
