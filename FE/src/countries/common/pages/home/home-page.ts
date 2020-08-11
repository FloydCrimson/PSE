import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';
import { SessionService } from 'global/services/session.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss']
})
export class HomePage {

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService
  ) { }

  public onContinueClicked(): void {
    this.sessionService.login().subscribe((result) => {
      if (result) {
        this.routingService.navigate('Forward', RoutesIndex.BoardPageRoute, undefined, { animationDirection: 'forward' });
      }
    });
  }

}
