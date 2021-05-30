import { Routes } from '@angular/router';

import * as GuardsIndex from '../indexes/guards.index';
import * as RoutesIndex from '../indexes/routes.index';

export const routes: Routes = [
    { path: '', redirectTo: RoutesIndex.AuthPageRoute.path, pathMatch: 'full' },
    { path: RoutesIndex.UnauthPageRoute.path, loadChildren: RoutesIndex.UnauthPageRoute.loadChildren },
    { path: RoutesIndex.AuthPageRoute.path, loadChildren: RoutesIndex.AuthPageRoute.loadChildren, canActivate: [GuardsIndex.AuthenticatedGuard] },
    { path: RoutesIndex.HomePageRoute.path, loadChildren: RoutesIndex.HomePageRoute.loadChildren, canActivate: [GuardsIndex.LoggedGuard] },
    { path: RoutesIndex.ChangeKeyPageRoute.path, loadChildren: RoutesIndex.ChangeKeyPageRoute.loadChildren, canActivate: [GuardsIndex.LoggedGuard] },
    { path: RoutesIndex.TestPageRoute.path, loadChildren: RoutesIndex.TestPageRoute.loadChildren },
    { path: '**', loadChildren: RoutesIndex.NotFoundPageRoute.loadChildren, canActivate: [GuardsIndex.NotFoundPageGuard] }
];
