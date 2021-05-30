import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { EnvironmentConfig } from '@environments/environment';

if (EnvironmentConfig.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch((error) => console.log(error));
