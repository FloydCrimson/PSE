import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UnauthPage } from './unauth-page';

import { ClickAsyncDirectiveModule } from 'global/directives/click-async/click-async-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClickAsyncDirectiveModule,
    RouterModule.forChild([
      {
        path: '',
        component: UnauthPage
      }
    ])
  ],
  declarations: [
    UnauthPage
  ]
})
export class UnauthPageModule { }
