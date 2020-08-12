import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CommentComponent } from './comment-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        CommentComponent
    ],
    exports: [
        CommentComponent
    ]
})
export class CommentComponentModule { }
