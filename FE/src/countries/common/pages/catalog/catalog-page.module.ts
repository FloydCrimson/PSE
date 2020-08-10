import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CatalogPage } from './catalog-page';
import { MediaComponent } from 'countries/common/components/media/media-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CatalogPage
      }
    ])
  ],
  entryComponents: [
    MediaComponent
  ],
  declarations: [
    CatalogPage,
    MediaComponent
  ]
})
export class CatalogPageModule { }
