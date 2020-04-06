import { Routes } from '@angular/router';

import * as GuardsIndex from '../guards.index';
import * as RoutesIndex from '../routes.index';

export const routes: Routes = [
    { path: '', redirectTo: RoutesIndex.AuthPageRoute.path, pathMatch: 'full' },
    { path: RoutesIndex.UnauthPageRoute.path, loadChildren: RoutesIndex.UnauthPageRoute.loadChildren },
    { path: RoutesIndex.AuthPageRoute.path, loadChildren: RoutesIndex.AuthPageRoute.loadChildren, canActivate: [GuardsIndex.AuthPageGuard] },
    { path: RoutesIndex.HomePageRoute.path, loadChildren: RoutesIndex.HomePageRoute.loadChildren, canActivate: [GuardsIndex.AuthGuard] },
    { path: '**', loadChildren: RoutesIndex.NotFoundPageRoute.loadChildren, canActivate: [GuardsIndex.NotFoundPageGuard] }
];
