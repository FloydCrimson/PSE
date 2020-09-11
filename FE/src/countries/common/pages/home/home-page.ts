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
    this.routingService.navigate('NavigateForward', RoutesIndex.TestPageRoute, { input: { title: 'HomePage' }, route: { page: 1 } }, { animationDirection: 'forward' });
  }

  public navigateBack(): void {
    this.routingService.navigate('NavigateBack', RoutesIndex.TestPageRoute, { input: { title: 'HomePage' }, route: { page: 1 } }, { animationDirection: 'forward' });
  }

  public navigateRoot(): void {
    this.routingService.navigate('NavigateRoot', RoutesIndex.TestPageRoute, { input: { title: 'HomePage' }, route: { page: 1 } }, { animationDirection: 'forward' });
  }

  public async present(): Promise<void> {
    const modal = await this.modalService.create(ModalsIndex.OverlayPageModal, { text: 'ciaone' });
    modal.onDidDismiss().then((result) => {
      console.log('HomePage', result);
    });
    await modal.present();
  }

}
