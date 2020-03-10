import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { InitializeService } from '@countries/services/initialize.service';
import { DeeplinksService } from 'global/services/deeplinks.service';
import { EnvironmentService } from 'global/services/environment.service';
import { StorageFactory } from 'global/factories/storage.factory';
import { RepositoryFactory } from 'global/factories/repository.factory';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly router: Router,
    private readonly initializeService: InitializeService,
    private readonly deeplinksService: DeeplinksService,
    private readonly environmentService: EnvironmentService,
    private readonly storageFactory: StorageFactory,
    private readonly repositoryFactory: RepositoryFactory,
  ) {
    this.start();
  }

  private async start(): Promise<void> {
    try {
      const source = await this.platform.ready();
      const ready = await this.initializeService.initialize();
      if (!ready) {
        throw 'The app was unable to initialize properly.';
      }
      console.log(source + ' is ready!');
      await this.initialize();
      await this.storageFactory.get('TempOutData').set('initialized', true);
    } catch (error) {
      console.log(error);
      await this.storageFactory.get('TempOutData').set('initialized', true);
    } finally {
      this.router.initialNavigation();
    }
  }

  private async initialize(): Promise<void> {
    if (this.environmentService.getPlatform() !== 'Browser') {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.deeplinksService.subscribe();
    }
    await this.storageFactory.get('TempOutData').set('logged', false);
  }

}
