import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CatalogPage } from './catalog-page';
import { PostComponentModule } from 'countries/common/components/post/post-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: CatalogPage
      }
    ])
  ],
  declarations: [
    CatalogPage
  ]
})
export class CatalogPageModule { }
