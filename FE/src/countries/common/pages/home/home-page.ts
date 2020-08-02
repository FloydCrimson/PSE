import { Component } from '@angular/core';

import { RoutingService } from 'global/services/routing.service';
import { SessionService } from 'global/services/session.service';

import { BackendEchoRest } from 'countries/common/rests/backend.echo.rest';
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
    private readonly backendEchoRest: BackendEchoRest,
    private readonly backendEchoSocket: BackendEchoSocket,
    private readonly sessionService: SessionService
  ) { }

  public onEchoGETClick() {
    this.backendEchoRest.EchoGET({ text: 'EchoGET' }).subscribe((result) => {
      console.log('HomePage.EchoGET', result);
    });
  }

  public onEchoPOSTClick() {
    this.backendEchoRest.EchoPOST({ text: 'EchoPOST' }).subscribe((result) => {
      console.log('HomePage.EchoPOST', result);
    });
  }

  public onEchoAuthPOSTClick() {
    this.backendEchoRest.EchoAuthPOST({ text: 'EchoAuthPOST' }).subscribe((result) => {
      console.log('HomePage.EchoAuthPOST', result);
    });
  }

  public onEchoSENDClick() {
    this.backendEchoSocket.EchoSEND({ text: 'EchoSEND' }).subscribe((result) => {
      console.log('HomePage.EchoSEND', result);
    });
  }

  public onEchoAuthSENDClick() {
    this.backendEchoSocket.EchoAuthSEND({ text: 'EchoAuthSEND' }).subscribe((result) => {
      console.log('HomePage.EchoAuthSEND', result);
    });
  }

  public onLogOutClick() {
    this.sessionService.logout().subscribe((result) => {
      if (!result) {
        console.warn('logout failed.');
      }
      this.routingService.navigateBack(RoutesIndex.UnauthPageRoute);
    });
  }

}
