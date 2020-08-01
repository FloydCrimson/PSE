import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';

import { BackendAuthRest } from 'countries/common/rests/backend.auth.rest';
import { BackendEchoSocket } from 'countries/common/sockets/backend.echo.socket';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss'],
})
export class HomePage {

  constructor(
    private readonly routingService: RoutingService,
    private readonly backendAuthRest: BackendAuthRest,
    private readonly backendEchoSocket: BackendEchoSocket
  ) { }

  public onEchoSENDClick() {
    this.backendEchoSocket.EchoSEND({ text: 'HomePage' }).subscribe((result) => {
      console.log('HomePage.EchoSEND', result);
    });
  }

  public onEchoAuthSENDClick() {
    this.backendEchoSocket.EchoAuthSEND({ text: 'HomePage' }).subscribe((result) => {
      console.log('HomePage.EchoAuthSEND', result);
    });
  }

  public onLogOutClick() {
    this.backendAuthRest.LogOut().subscribe((result) => {
      if (result.success) {
        this.routingService.navigateBack(RoutesIndex.UnauthPageRoute);
      }
    });
  }

}
