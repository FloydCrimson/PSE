import { Component } from '@angular/core';

import { PSERouteController } from '@pse-fe/core';

import { BackendEchoRestService } from 'countries/common/rests/backend.echo.rest.service';
import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import * as RoutesIndex from '@countries/indexes/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss']
})
export class HomePage {

  constructor(
    private readonly pseRouteController: PSERouteController,
    private readonly backendEchoRestService: BackendEchoRestService,
    private readonly backendAuthRestService: BackendAuthRestService
  ) { }

  public onEchoClicked(): void {
    this.backendEchoRestService.Echo({ text: 'Echo' }).subscribe((result) => {
      console.log('Echo', result);
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onEchoAuthFullClicked(): void {
    this.backendEchoRestService.EchoAuthFull({ text: 'EchoAuthFull' }).subscribe((result) => {
      console.log('Echo', result);
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onEchoAuthPartialClicked(): void {
    this.backendEchoRestService.EchoAuthPartial({ text: 'EchoAuthPartial' }).subscribe((result) => {
      console.log('Echo', result);
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onLogOutClicked(): void {
    this.backendAuthRestService.LogOut().subscribe(_ => {
      this.pseRouteController.navigate('NavigateRoot', RoutesIndex.AuthPageRoute, undefined, { animationDirection: 'back' });
    });
  }

  public onSignOutClicked(): void {
    this.backendAuthRestService.SignOut().subscribe(_ => {
      this.pseRouteController.navigate('NavigateRoot', RoutesIndex.UnauthPageRoute, undefined, { animationDirection: 'back' });
    });
  }

}
