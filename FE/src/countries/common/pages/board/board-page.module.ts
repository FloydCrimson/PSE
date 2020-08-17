import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BackButtonClickDirectiveModule } from 'countries/common/directives/back-button-click/back-button-click-directive.module';

import { BoardPage } from './board-page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackButtonClickDirectiveModule,
    RouterModule.forChild([{ path: '', component: BoardPage }])
  ],
  declarations: [
    BoardPage
  ]
})
export class BoardPageModule { }
