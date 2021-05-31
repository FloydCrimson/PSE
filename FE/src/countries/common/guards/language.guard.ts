import { InjectionToken } from '@angular/core';
import { CanActivate, UrlTree, Route, UrlSegment } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LanguageService } from 'global/services/language.service';

export function LanguageGuardProvider(token: string, paths: string[]) {
    return {
        provide: new InjectionToken<CanActivate>('language.guard.' + token),
        useFactory: ((URLs: string[]) => {
            return (translateService: TranslateService, languageService: LanguageService) => {
                return (route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
                    languageService.addURLs(URLs);
                    return translateService.reloadLang(translateService.currentLang).toPromise().then(_ => true).catch(_ => true);
                }
            }
        })(paths),
        deps: [TranslateService, LanguageService]
    };
}
