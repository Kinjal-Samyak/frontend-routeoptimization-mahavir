import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./features/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'home',
        canActivateChild: [AuthGuard],
        loadChildren: () =>
            import('./features/home/home.module').then((m) => m.HomeModule),
    },
    { path: '**', redirectTo: 'home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
