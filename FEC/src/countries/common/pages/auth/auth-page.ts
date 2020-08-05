import { Component } from '@angular/core';

import { StorageFactory } from 'global/factories/storage.factory';
import { RestFactory } from 'global/factories/rest.factory';
import { RoutingService } from 'global/services/routing.service';

@Component({
  selector: 'auth-page',
  templateUrl: 'auth-page.html',
  styleUrls: ['auth-page.scss'],
})
export class AuthPage {

  constructor(
    private readonly storageFactory: StorageFactory,
    private readonly restFactory: RestFactory,
    private readonly routingService: RoutingService
  ) { }

}
