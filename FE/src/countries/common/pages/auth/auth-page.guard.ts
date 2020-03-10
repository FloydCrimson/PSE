import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { StorageFactory } from 'global/factories/storage.factory';
import * as RoutesIndex from '@countries/routes.index';

@Injectable({
  providedIn: 'root'
})
export class AuthPageGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly storageFactory: StorageFactory,
  ) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const credentials: { crypted: string; auth: boolean; } = await this.storageFactory.get('PersOutData').get('credentials');
    return (credentials && credentials.auth) ? true : this.router.parseUrl(RoutesIndex.UnauthPageRoute.path);
  }

}
