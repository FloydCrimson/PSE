import { Component } from '@angular/core';

import { PSENavController } from '@pse-fe/core';

import { BackendEchoRestService } from 'countries/common/rests/backend.echo.rest.service';
import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss']
})
export class HomePage {

  constructor(
    private readonly pseNavController: PSENavController,
    private readonly BackendEchoRestService: BackendEchoRestService,
    private readonly backendAuthRestService: BackendAuthRestService
  ) { }

  public onEchoClicked(): void {
    this.BackendEchoRestService.Echo({ text: 'Echo' }).subscribe((result) => {
      console.log('Echo', result);
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onEchoAuthClicked(): void {
    this.BackendEchoRestService.EchoAuth({ text: 'Echo' }).subscribe((result) => {
      console.log('Echo', result);
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onLogOutClicked(): void {
    this.backendAuthRestService.LogOut().subscribe(_ => {
      this.pseNavController.navigate('NavigateRoot', RoutesIndex.AuthPageRoute, undefined, { animationDirection: 'back' });
    });
  }

}
