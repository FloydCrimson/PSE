import { LoadChildren } from '@angular/router';

export interface RouteImplementation<I = undefined, Q = undefined, R = undefined> {
    path: string;
    route?: (keyof R)[];
    loadChildren: LoadChildren;
}
