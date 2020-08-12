import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ViewportVisibilityChangeDirectiveModule } from 'countries/common/directives/viewport-visibility-change/viewport-visibility-change-directive.module';

import { MediaComponentModule } from '../media/media-component.module';
import { CommentComponentModule } from '../comment/comment-component.module';

import { PostComponent } from './post-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MediaComponentModule,
        CommentComponentModule,
        ViewportVisibilityChangeDirectiveModule
    ],
    declarations: [
        PostComponent
    ],
    exports: [
        PostComponent
    ]
})
export class PostComponentModule { }
