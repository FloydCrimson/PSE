import { LoadChildren } from '@angular/router';

export interface RouteImplementation<I = undefined, R extends { [key: string]: any; } = undefined, Q extends { [key: string]: any; } = undefined> {
    path: string;
    loadChildren: LoadChildren;
    defaultInput?: I;
}
