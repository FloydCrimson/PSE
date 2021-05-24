import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar as CapacitorStatusBarPlugin, Style } from '@capacitor/status-bar';
import { SplashScreen as CapacitorSplashScreenPlugin } from '@capacitor/splash-screen';

import { DeeplinksService } from 'global/services/deeplinks.service';
import { PlatformService } from 'global/services/platform.service';
import { PlatformEnum } from 'global/common/enum/platform.enum';
import { LoggingService } from 'global/services/logging.service';
import { EphemeralStorageFactory } from 'global/factories/ephemeral-storages.factory';

import { InitializeService } from '@countries/services/initialize.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly router: Router,
    private readonly initializeService: InitializeService,
    private readonly deeplinksService: DeeplinksService,
    private readonly platformService: PlatformService,
    private readonly loggingService: LoggingService,
    private readonly eStorageFactory: EphemeralStorageFactory
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
      this.loggingService.LOG('INFO', { class: AppComponent.name, function: this.start.name, text: source + ' is ready!' });
      this.eStorageFactory.get('Out').set('initialized', true);
    } catch (error) {
      this.loggingService.LOG('FATAL', { class: AppComponent.name, function: this.start.name }, error);
      this.eStorageFactory.get('Out').set('initialized', false);
    } finally {
      this.eStorageFactory.get('Out').set('logged', false);
      if (this.platformService.isPlatform(PlatformEnum.Mobile)) {
        await CapacitorStatusBarPlugin.setStyle({ style: Style.Light });
        await CapacitorSplashScreenPlugin.hide();
        this.deeplinksService.subscribe();
      }
      this.router.initialNavigation();
    }
  }

}
