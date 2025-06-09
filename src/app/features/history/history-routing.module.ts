import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history.component';
import { HistoryDetailsComponent } from './history-details/history-details.component';

const routes: Routes = [
    {
        path: '',
        component: HistoryComponent
    },
    {
        path: 'detail',
        component: HistoryDetailsComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HistoryRoutingModule { }
