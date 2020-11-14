import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthPage } from './auth-page';

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
        component: AuthPage
      }
    ])
  ],
  declarations: [
    AuthPage
  ]
})
export class AuthPageModule { }
