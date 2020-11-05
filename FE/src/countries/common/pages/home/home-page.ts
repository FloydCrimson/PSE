import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';
import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss']
})
export class HomePage {

  constructor(
    private readonly routingService: RoutingService,
    private readonly backendAuthRestService: BackendAuthRestService
  ) { }

  public onLogOutClicked(): void {
    this.backendAuthRestService.LogOut().subscribe(_ => {
      this.routingService.navigate('NavigateRoot', RoutesIndex.AuthPageRoute, undefined, { animationDirection: 'back' });
    });
  }

}
