import { NgModule, Optional, SkipSelf, ModuleWithProviders } from "@angular/core";

import { PSELanguageServiceConfig, PSELanguageService } from "../services/language.service";

@NgModule({
    providers: [
        PSELanguageService
    ]
})
export class PSELanguageModule {

    constructor(
        @Optional() @SkipSelf() parentModule?: PSELanguageModule
    ) {
        if (parentModule) {
            throw new Error('"LanguageServiceModule" is already loaded. Import it in the AppModule only.');
        }
    }

    public static forRoot(config?: PSELanguageServiceConfig): ModuleWithProviders<PSELanguageModule> {
        return {
            ngModule: PSELanguageModule,
            providers: [
                { provide: PSELanguageServiceConfig, useValue: config }
            ]
        };
    }

}
