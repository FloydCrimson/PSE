import { LoadChildren } from '@angular/router';

export interface RouteImplementation<I = {}, Q = {}, R = {}> {
    path: string;
    route?: (keyof R)[];
    loadChildren: LoadChildren;
}
