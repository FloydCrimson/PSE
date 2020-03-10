import { Component, OnInit } from '@angular/core';

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
  ) { }

}
