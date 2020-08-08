import { LoadChildren } from '@angular/router';

export interface RouteImplementation<I, O> {
    path: string;
    loadChildren: LoadChildren;
}
