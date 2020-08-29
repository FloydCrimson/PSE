import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { StorageFactory } from 'global/factories/storage.factory';

import * as RoutesIndex from '@countries/routes.index';

@Injectable({
    providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly storageFactory: StorageFactory,
    ) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const logged: boolean = await this.storageFactory.get('TempOutData').get('logged');
        return logged ? true : this.router.parseUrl(RoutesIndex.BoardPageRoute.path);
    }

}
