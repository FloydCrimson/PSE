import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { PSEModalController } from '../controllers/modal.controller';
import { PSERouteController } from '../controllers/route.controller';
import { PSEBusyService } from '../services/busy.service';
import { PSELoadingService } from '../services/loading.service';
import { PSEPipeService } from '../services/pipe.service';
import { PSECoreService, PSECoreServiceConfig } from '../services/core.service';

@NgModule({
    providers: [
        PSEModalController,
        PSERouteController,
        PSEBusyService,
        PSELoadingService,
        PSEPipeService,
        PSECoreService
    ]
})
export class PSECoreModule {

    constructor(
        @Optional() @SkipSelf() parentModule?: PSECoreModule
    ) {
        if (parentModule) {
            throw new Error('"PSECoreModule" is already loaded. Import it in the AppModule only.');
        }
    }

    static forRoot(config?: PSECoreServiceConfig): ModuleWithProviders<PSECoreModule> {
        return {
            ngModule: PSECoreModule,
            providers: [
                { provide: PSECoreServiceConfig, useValue: config }
            ]
        };
    }

}
