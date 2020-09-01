import { LoadChildren } from '@angular/router';

export interface RouteImplementation<I = any | null, R = { [key: string]: any; } | null, Q = { [key: string]: any; } | null, F = string> {
    path: string;
    defaultInput?: I;
    route?: (keyof R)[];
    loadChildren: LoadChildren;
}
