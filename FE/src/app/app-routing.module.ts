import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule } from '@angular/router';

import { EnvironmentConfig } from '@environments/environment';
import { routes } from '@countries/services/routing.service';

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, enableTracing: EnvironmentConfig.enableRouterTracing, initialNavigation: 'disabled', relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
