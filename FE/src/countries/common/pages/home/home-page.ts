import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';
import { ModalService } from 'global/services/modal.service';

import * as RoutesIndex from '@countries/routes.index';
import * as ModalsIndex from '@countries/modals.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss'],
})
export class HomePage {

  constructor(
    private readonly routingService: RoutingService,
    private readonly modalService: ModalService
  ) {
    const { input, query, route } = this.routingService.getNavigationParams(RoutesIndex.HomePageRoute);
    console.log('HomePage.NavigationParams', input, query, route);
  }

  public navigateForward(): void {
    this.routingService.navigate('Forward', RoutesIndex.TestPageRoute, { input: { title: 'HomePage' }, route: { page: 1 } }, { animationDirection: 'forward' });
  }

  public navigateBack(): void {
    this.routingService.navigate('Back', RoutesIndex.TestPageRoute, { input: { title: 'HomePage' }, route: { page: 1 } }, { animationDirection: 'forward' });
  }

  public navigateRoot(): void {
    this.routingService.navigate('Root', RoutesIndex.TestPageRoute, { input: { title: 'HomePage' }, route: { page: 1 } }, { animationDirection: 'forward' });
  }

  public async present(): Promise<void> {
    const modal = await this.modalService.present(ModalsIndex.OverlayPageModal, { text: 'ciaone' });
    await modal.present();
  }

}
