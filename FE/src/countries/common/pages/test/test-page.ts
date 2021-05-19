import { Component } from '@angular/core';

import { PSENavController } from '@pse-fe/core';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'test-page',
  templateUrl: 'test-page.html',
  styleUrls: ['test-page.scss']
})
export class TestPage {

  public readonly params = this.pseNavController.getNavigationParams(RoutesIndex.TestPageRoute);

  constructor(
    private readonly pseNavController: PSENavController
  ) { }

  // Events

  public async onButtonClicked(): Promise<void> {
    await this.pseNavController.navigate('NavigateRoot', RoutesIndex.HomePageRoute, undefined, { animationDirection: 'forward' });
  }

}
