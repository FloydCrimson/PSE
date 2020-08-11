import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CommentComponent } from './comment/comment-component';
import { MediaComponent } from './media/media-component';
import { PostComponent } from './post/post-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        CommentComponent,
        MediaComponent,
        PostComponent
    ],
    exports: [
        CommentComponent,
        MediaComponent,
        PostComponent
    ]
})
export class ComponentsModule { }
