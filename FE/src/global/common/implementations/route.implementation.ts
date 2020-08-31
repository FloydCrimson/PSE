import { LoadChildren } from '@angular/router';

export interface RouteImplementation<I = any | undefined, R = { [key: string]: any; } | undefined, Q = { [key: string]: any; } | undefined, F = string | undefined> {
    path: string;
    default?: I;
    route?: (keyof R)[];
    loadChildren: LoadChildren;
}
