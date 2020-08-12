import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ViewportVisibilityChangeDirective } from './viewport-visibility-change-directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        ViewportVisibilityChangeDirective
    ],
    exports: [
        ViewportVisibilityChangeDirective
    ],
    providers: [
        ViewportVisibilityChangeDirective
    ]
})
export class ViewportVisibilityChangeDirectiveModule { }
