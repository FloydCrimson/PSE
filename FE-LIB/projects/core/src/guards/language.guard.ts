import { InjectionToken } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { PSELanguageService } from '../services/language.service';

export function PSELanguageGuardProvider(token: string, URLs: string[]) {
    return {
        provide: new InjectionToken<CanLoad>('pse-language.guard.' + token),
        useFactory: ((URLs: string[]) => {
            return (translateService: TranslateService, languageService: PSELanguageService) => {
                return (route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
                    languageService.addURLs(URLs);
                    return translateService.reloadLang(translateService.currentLang).toPromise().then(_ => true).catch(_ => true);
                }
            }
        })(URLs),
        deps: [TranslateService, PSELanguageService]
    };
}
