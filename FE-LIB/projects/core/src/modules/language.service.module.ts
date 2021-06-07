import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';

import { PSELanguageServiceConfig, PSELanguageService } from '../services/language.service';

@NgModule()
export class PSELanguageServiceModule {

    constructor(
        @Optional() @SkipSelf() parentModule?: PSELanguageServiceModule
    ) {
        if (parentModule) {
            throw new Error('"PSELanguageServiceModule" is already loaded. Import it in the AppModule only.');
        }
    }

    public static forRoot(config?: PSELanguageServiceConfig): ModuleWithProviders<PSELanguageServiceModule> {
        return {
            ngModule: PSELanguageServiceModule,
            providers: [
                { provide: PSELanguageServiceConfig, useValue: config },
                PSELanguageService
            ]
        };
    }

}
