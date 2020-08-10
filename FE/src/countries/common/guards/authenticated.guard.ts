import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { StorageFactory } from 'global/factories/storage.factory';

import * as RoutesIndex from '@countries/routes.index';

@Injectable({
    providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly storageFactory: StorageFactory,
    ) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const authenticated: boolean = await this.storageFactory.get('PersOutData').get('authenticated');
        return authenticated ? true : this.router.parseUrl(RoutesIndex.HomePageRoute.path);
    }

}
