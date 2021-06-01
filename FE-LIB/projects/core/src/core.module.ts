import { ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { NgModule } from '@angular/core';

import { PSEModalController } from './controllers/modal.controller';
import { PSERouteController } from './controllers/route.controller';

import { PSEBusyService } from './services/busy.service';
import { PSELoadingService } from './services/loading.service';
import { PSEPipeService } from './services/pipe.service';

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        PSEModalController,
        PSERouteController,
        PSEBusyService,
        PSELoadingService,
        PSEPipeService
    ],
    exports: []
})
export class PSECoreModule {

    constructor(@Optional() @SkipSelf() parentModule?: PSECoreModule) {
        if (parentModule) {
            throw new Error('PSECoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config?: PSECoreModuleConfig): ModuleWithProviders<PSECoreModule> {
        return {
            ngModule: PSECoreModule,
            providers: [
                { provide: PSECoreModuleConfig, useValue: config }
            ]
        };
    }

}
export class PSECoreModuleConfig { }

/*
 * Public API Surface of core
 */

export { PSEModalController, PSEModal } from './controllers/modal.controller';
export { PSERouteController, PSERoute } from './controllers/route.controller';
export { PSEBusyService } from './services/busy.service';
export { PSELoadingService } from './services/loading.service';
export { PSEPipeService } from './services/pipe.service';
