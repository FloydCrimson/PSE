import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { environment } from '@environments/environment';
import { routes } from '@countries/services/routing.service';

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: environment.enableRouterTracing, initialNavigation: 'disabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
