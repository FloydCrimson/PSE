import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss'],
})
export class HomePage {

  constructor(
    private readonly routingService: RoutingService
  ) {
    const navParams = this.routingService.getNavigationParams(RoutesIndex.HomePageRoute);
    console.log('navParams', navParams);
  }

  public navigateForward(): void {
    this.routingService.navigate('Forward', RoutesIndex.TestPageRoute, { page: 'HomePage' }, { animationDirection: 'forward' });
  }

  public navigateBack(): void {
    this.routingService.navigate('Back', RoutesIndex.TestPageRoute, { page: 'HomePage' }, { animationDirection: 'forward' });
  }

  public navigateRoot(): void {
    this.routingService.navigate('Root', RoutesIndex.TestPageRoute, { page: 'HomePage' }, { animationDirection: 'forward' });
  }

}
