import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'test-page',
  templateUrl: 'test-page.html',
  styleUrls: ['test-page.scss'],
})
export class TestPage {

  constructor(
    private readonly routingService: RoutingService
  ) {
    const navParams = this.routingService.getNavigationParams(RoutesIndex.TestPageRoute);
    console.log('navParams', navParams);
  }

  public navigateForward(): void {
    this.routingService.navigate('Forward', RoutesIndex.HomePageRoute, { page: 'TestPage' }, { animationDirection: 'back' });
  }

  public navigateBack(): void {
    this.routingService.navigate('Back', RoutesIndex.HomePageRoute, { page: 'TestPage' }, { animationDirection: 'back' });
  }

  public navigateRoot(): void {
    this.routingService.navigate('Root', RoutesIndex.HomePageRoute, { page: 'TestPage' }, { animationDirection: 'back' });
  }

}
