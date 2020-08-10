import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ThreadPage } from './thread-page';
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
    MediaComponent
  ],
  declarations: [
    ThreadPage,
    MediaComponent
  ]
})
export class ThreadPageModule { }
