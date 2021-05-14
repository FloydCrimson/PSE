import { ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { NgModule } from '@angular/core';

import * as Controllers from './controllers';

@NgModule({
    imports: [],
    declarations: [],
    providers: [],
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
                Controllers.PSENavController,
                { provide: PSECoreModuleConfig, useValue: config }
            ]
        };
    }

}
export class PSECoreModuleConfig { }

/*
 * Public API Surface of core
 */

export * from './controllers';
