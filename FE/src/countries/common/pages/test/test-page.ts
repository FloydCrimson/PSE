import { Component } from '@angular/core';

import { PSEModalController, PSERouteController } from '@pse-fe/core';

import * as RoutesIndex from '@countries/indexes/routes.index';
import * as ModalsIndex from '@countries/indexes/modals.index';

@Component({
  selector: 'test-page',
  templateUrl: 'test-page.html',
  styleUrls: ['test-page.scss']
})
export class TestPage {

  public params = this.pseRouteController.getNavigationParams(RoutesIndex.TestPageRoute);

  constructor(
    private readonly pseRouteController: PSERouteController,
    private readonly pseModalController: PSEModalController
  ) { }

  // Events

  public async onOpenModalClicked(): Promise<void> {
    const params = PSEModalController.getParams(ModalsIndex.TestComponentModal);
    params.input = { message: 'CIAONE' };
    const modal = await this.pseModalController.create(ModalsIndex.TestComponentModal, params);
    await modal.present();
  }

  public async onBackClicked(): Promise<void> {
    await this.pseRouteController.navigate('NavigateRoot', RoutesIndex.HomePageRoute, undefined, { animationDirection: 'forward' });
  }

}
