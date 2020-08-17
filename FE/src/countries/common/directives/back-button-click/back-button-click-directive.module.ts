import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { BackButtonClickDirective } from './back-button-click-directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        BackButtonClickDirective
    ],
    exports: [
        BackButtonClickDirective
    ],
    providers: [
        BackButtonClickDirective
    ]
})
export class BackButtonClickDirectiveModule { }
