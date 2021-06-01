import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { PSECoreModule } from '@pse-fe/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LanguageService } from 'global/services/language.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({ mode: 'md' }),
    IonicStorageModule.forRoot({ name: 'IonicStorage' }),
    AppRoutingModule,
    PSECoreModule.forRoot(),
    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useExisting: LanguageService }, missingTranslationHandler: { provide: MissingTranslationHandler, useExisting: LanguageService } })
  ],
  providers: [
    Deeplinks,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
