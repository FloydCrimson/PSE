import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ThreadPage } from './thread-page';
import { PostComponent } from 'countries/common/components/post/post-component';
import { MediaComponent } from 'countries/common/components/media/media-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ThreadPage
      }
    ])
  ],
  entryComponents: [
    PostComponent,
    MediaComponent
  ],
  declarations: [
    ThreadPage,
    PostComponent,
    MediaComponent
  ]
})
export class ThreadPageModule { }
