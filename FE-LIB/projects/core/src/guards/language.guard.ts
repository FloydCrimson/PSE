import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { PSELanguageService } from '../services/language.service';

export class PSELanguageGuardConfig {
    URLs = new Array<string>();
}

@Injectable()
export abstract class PSELanguageGuard implements CanLoad {

    constructor(
        protected readonly translateService: TranslateService,
        protected readonly config: PSELanguageGuardConfig
    ) { }

    public canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const languageService = this.translateService.currentLoader as PSELanguageService;
        languageService.addURLs(this.config.URLs);
        return this.canLoadLang(route, segments, this.translateService.reloadLang(this.translateService.currentLang));
    }

    public abstract canLoadLang(route: Route, segments: UrlSegment[], observable: Observable<any>): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;

}
