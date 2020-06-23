import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { InitializeService } from '@countries/services/initialize.service';
import { DeeplinksService } from 'global/services/deeplinks.service';
import { PlatformService } from 'global/services/platform.service';
import { StorageFactory } from 'global/factories/storage.factory';
import { PlatformEnum } from 'global/common/enum/platform.enum';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly router: Router,
    private readonly initializeService: InitializeService,
    private readonly deeplinksService: DeeplinksService,
    private readonly platformService: PlatformService,
    private readonly storageFactory: StorageFactory
  ) {
    this.start();
  }

  private async start(): Promise<void> {
    try {
      const source = await this.platformService.ready();
      const ready = await this.initializeService.initialize();
      if (!ready) {
        throw 'The app was unable to initialize properly.';
      }
      console.log(source + ' is ready!');
      await this.initialize();
      await this.storageFactory.get('TempOutData').set('initialized', true);
    } catch (error) {
      console.log(error);
      await this.storageFactory.get('TempOutData').set('initialized', false);
    } finally {
      this.router.initialNavigation();
    }
  }

  private async initialize(): Promise<void> {
    if (this.platformService.isPlatform(PlatformEnum.Mobile)) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.deeplinksService.subscribe();
    }
    await this.storageFactory.get('TempOutData').set('logged', false);
  }

}
