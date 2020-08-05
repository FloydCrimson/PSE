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
    const activated = await this.storageFactory.get('PersOutData').get('activated');
    return activated ? true : this.router.parseUrl(RoutesIndex.UnauthPageRoute.path);
  }

}
