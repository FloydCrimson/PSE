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
    const { input, query, route } = this.routingService.getNavigationParams(RoutesIndex.TestPageRoute);
    console.log('TestPage.NavigationParams', input, query, route);
  }

  public navigateForward(): void {
    this.routingService.navigate('Forward', RoutesIndex.HomePageRoute, { input: { title: 'TestPage' } }, { animationDirection: 'back' });
  }

  public navigateBack(): void {
    this.routingService.navigate('Back', RoutesIndex.HomePageRoute, { input: { title: 'TestPage' } }, { animationDirection: 'back' });
  }

  public navigateRoot(): void {
    this.routingService.navigate('Root', RoutesIndex.HomePageRoute, { input: { title: 'TestPage' } }, { animationDirection: 'back' });
  }

}
