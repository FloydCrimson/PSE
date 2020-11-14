import { NgModule } from '@angular/core';

import { ClickAsyncDirective } from './click-async-directive';

@NgModule({
    declarations: [
        ClickAsyncDirective
    ],
    exports: [
        ClickAsyncDirective
    ]
})
export class ClickAsyncDirectiveModule { }
