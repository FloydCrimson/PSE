import { NgModule } from '@angular/core';

import { PSEPipeService } from './pipe.service';
import { PSEBusyService } from './busy.service';
import { PSELoadingService } from './loading.service';

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        PSEPipeService,
        PSEBusyService,
        PSELoadingService
    ],
    exports: []
})
export class PSEServicesModule { }
