import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BackButtonClickDirectiveModule } from 'countries/common/directives/back-button-click/back-button-click-directive.module';
import { PostComponentModule } from 'countries/common/components/post/post-component.module';

import { ThreadPage } from './thread-page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackButtonClickDirectiveModule,
    PostComponentModule,
    RouterModule.forChild([{ path: '', component: ThreadPage }])
  ],
  declarations: [
    ThreadPage
  ]
})
export class ThreadPageModule { }
