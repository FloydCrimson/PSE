import { ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { NgModule } from '@angular/core';
import { PSEControllersModule } from './controllers/controllers.module';

@NgModule({
    imports: [
        PSEControllersModule
    ],
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
