import { Injectable } from '@angular/core';
import { Route, UrlSegment, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { PSELanguageGuard, PSELanguageServiceURL, PSELanguageServiceURLTypeEnum } from '@pse-fe/core';

const URLs = new Array<PSELanguageServiceURL>(
    ['unauth-page.json', PSELanguageServiceURLTypeEnum.Custom]
);

@Injectable()
export class UnauthPageLanguageGuard extends PSELanguageGuard {

    constructor(
        protected readonly translateService: TranslateService
    ) {
        super(translateService, { URLs });
    }

    public canLoadLang(route: Route, segments: UrlSegment[], observable: Observable<any>): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return observable.toPromise().then(_ => true).catch(_ => false);
    }

}
