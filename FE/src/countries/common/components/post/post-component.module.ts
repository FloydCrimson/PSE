import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { MediaComponentModule } from '../media/media-component.module';
import { TitleComponentModule } from '../title/title-component.module';
import { CommentComponentModule } from '../comment/comment-component.module';

import { PostComponent } from './post-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MediaComponentModule,
        TitleComponentModule,
        CommentComponentModule
    ],
    declarations: [
        PostComponent
    ],
    exports: [
        PostComponent
    ]
})
export class PostComponentModule { }
