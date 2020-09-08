import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BackButtonClickDirectiveModule } from 'countries/common/directives/back-button-click/back-button-click-directive.module';
import { ViewportVisibilityChangeDirectiveModule } from 'countries/common/directives/viewport-visibility-change/viewport-visibility-change-directive.module';
import { PostComponentModule } from 'countries/common/components/post/post-component.module';

import { ArchivePage } from './archive-page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackButtonClickDirectiveModule,
    ViewportVisibilityChangeDirectiveModule,
    PostComponentModule,
    RouterModule.forChild([{ path: '', component: ArchivePage }])
  ],
  declarations: [
    ArchivePage
  ]
})
export class ArchivePageModule { }
