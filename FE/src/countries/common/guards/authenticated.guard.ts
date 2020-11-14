import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { PersistentStorageFactory } from 'global/factories/persistent-storages.factory';

import * as RoutesIndex from '@countries/routes.index';

@Injectable({
    providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly pStorageFactory: PersistentStorageFactory
    ) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const authenticated = await this.pStorageFactory.get('Local').get('authenticated');
        return authenticated ? true : this.router.parseUrl(RoutesIndex.UnauthPageRoute.path);
    }

}
