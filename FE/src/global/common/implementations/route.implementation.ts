import { LoadChildren } from '@angular/router';

export interface RouteImplementation<P> {
    path: string;
    loadChildren: LoadChildren;
}
