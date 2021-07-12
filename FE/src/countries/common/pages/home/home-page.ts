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

  public readonly echoes: { name: string; method: () => void; }[];

  constructor(
    private readonly pseRouteController: PSERouteController,
    private readonly backendEchoRestService: BackendEchoRestService,
    private readonly backendAuthRestService: BackendAuthRestService
  ) {
    const methods: (keyof BackendEchoRestService)[] = ['EchoGET', 'EchoPOST', 'EchoAuthFullGET', 'EchoAuthFullPOST', 'EchoAuthFullCryptedGET', 'EchoAuthFullCryptedPOST', 'EchoAuthPartialGET', 'EchoAuthPartialPOST', 'EchoAuthPartialCryptedGET', 'EchoAuthPartialCryptedPOST'];
    this.echoes = methods.map((method) => {
      return {
        name: method,
        method: () => this.backendEchoRestService[method]({ text: method }).subscribe((result) => {
          console.log(method, result);
        }, (error) => {
          alert(JSON.stringify(error));
        })
      };
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
