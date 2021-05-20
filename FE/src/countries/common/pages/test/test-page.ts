import { Component } from '@angular/core';

import { PSERoutingController } from '@pse-fe/core';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'test-page',
  templateUrl: 'test-page.html',
  styleUrls: ['test-page.scss']
})
export class TestPage {

  public readonly params = this.pseRoutingController.getNavigationParams(RoutesIndex.TestPageRoute);

  constructor(
    private readonly pseRoutingController: PSERoutingController
  ) { }

  // Events

  public async onButtonClicked(): Promise<void> {
    await this.pseRoutingController.navigate('NavigateRoot', RoutesIndex.HomePageRoute, undefined, { animationDirection: 'forward' });
  }

}
