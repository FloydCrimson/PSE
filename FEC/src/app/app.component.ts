import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBarStyle } from '@capacitor/core';

import { DeeplinksService } from 'global/services/deeplinks.service';
import { PlatformService } from 'global/services/platform.service';
import { PlatformEnum } from 'global/common/enum/platform.enum';
import { LoggingService } from 'global/services/logging.service';
import { StorageFactory } from 'global/factories/storage.factory';
import { PluginService } from 'global/services/plugin.service';

import { InitializeService } from '@countries/services/initialize.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly pluginService: PluginService,
    private readonly router: Router,
    private readonly initializeService: InitializeService,
    private readonly deeplinksService: DeeplinksService,
    private readonly platformService: PlatformService,
    private readonly loggingService: LoggingService,
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
      this.loggingService.LOG('INFO', { class: AppComponent.name, function: this.start.name, text: source + ' is ready!' });
      await this.initialize();
      await this.storageFactory.get('TempOutData').set('initialized', true);
    } catch (error) {
      this.loggingService.LOG('FATAL', { class: AppComponent.name, function: this.start.name }, error);
      await this.storageFactory.get('TempOutData').set('initialized', false);
    } finally {
      this.router.initialNavigation();
    }
  }

  private async initialize(): Promise<void> {
    if (this.platformService.isPlatform(PlatformEnum.Mobile)) {
      this.pluginService.get('StatusBar').setStyle({ style: StatusBarStyle.Light });
      this.pluginService.get('SplashScreen').hide();
      this.deeplinksService.subscribe();
    }
    await this.storageFactory.get('TempOutData').set('logged', false);
  }

}
