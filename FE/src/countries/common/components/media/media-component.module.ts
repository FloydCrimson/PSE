import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ViewportVisibilityChangeDirectiveModule } from 'countries/common/directives/viewport-visibility-change/viewport-visibility-change-directive.module';

import { MediaComponent } from './media-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewportVisibilityChangeDirectiveModule
    ],
    declarations: [
        MediaComponent
    ],
    exports: [
        MediaComponent
    ]
})
export class MediaComponentModule { }
