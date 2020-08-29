import { Routes } from '@angular/router';

import * as GuardsIndex from '../guards.index';
import * as RoutesIndex from '../routes.index';

export const routes: Routes = [
    { path: '', redirectTo: RoutesIndex.BoardPageRoute.path, pathMatch: 'full' },
    { path: RoutesIndex.BoardPageRoute.path, loadChildren: RoutesIndex.BoardPageRoute.loadChildren },
    { path: RoutesIndex.CatalogPageRoute.path, loadChildren: RoutesIndex.CatalogPageRoute.loadChildren },
    { path: RoutesIndex.ThreadPageRoute.path, loadChildren: RoutesIndex.ThreadPageRoute.loadChildren },
    { path: '**', loadChildren: RoutesIndex.NotFoundPageRoute.loadChildren }
];
