import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { TitleComponent } from './title-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        TitleComponent
    ],
    exports: [
        TitleComponent
    ]
})
export class TitleComponentModule { }
