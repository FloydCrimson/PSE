import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { EphemeralStorageFactory } from 'global/factories/ephemeral-storages.factory';

import * as RoutesIndex from '@countries/routes.index';

@Injectable({
    providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly eStorageFactory: EphemeralStorageFactory,
    ) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const logged = this.eStorageFactory.get('Out').get('logged');
        return logged ? true : this.router.parseUrl(RoutesIndex.AuthPageRoute.path);
    }

}
