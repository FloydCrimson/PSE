import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import * as RoutesIndex from '@countries/indexes/routes.index';

@Injectable({
    providedIn: 'root'
})
export class NotFoundPageGuard implements CanActivate {

    constructor(
        private readonly router: Router
    ) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return this.router.parseUrl(RoutesIndex.HomePageRoute.path);
    }

}
