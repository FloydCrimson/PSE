import { Routes } from '@angular/router';

import * as GuardsIndex from '../guards.index';
import * as RoutesIndex from '../routes.index';

export const routes: Routes = [
    { path: '', redirectTo: RoutesIndex.HomePageRoute.path, pathMatch: 'full' },
    { path: RoutesIndex.HomePageRoute.path, loadChildren: RoutesIndex.HomePageRoute.loadChildren },
    { path: RoutesIndex.BoardPageRoute.path, loadChildren: RoutesIndex.BoardPageRoute.loadChildren, canActivate: [GuardsIndex.LoggedGuard] },
    { path: RoutesIndex.CatalogPageRoute.path, loadChildren: RoutesIndex.CatalogPageRoute.loadChildren, canActivate: [GuardsIndex.LoggedGuard] },
    { path: RoutesIndex.ThreadPageRoute.path, loadChildren: RoutesIndex.ThreadPageRoute.loadChildren, canActivate: [GuardsIndex.LoggedGuard] },
    { path: '**', loadChildren: RoutesIndex.NotFoundPageRoute.loadChildren, canActivate: [GuardsIndex.NotFoundPageGuard] }
];
