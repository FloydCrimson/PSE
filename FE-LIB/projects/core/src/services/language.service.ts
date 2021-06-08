import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { Observable, zip, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { PSEMergerProvider } from '../providers/merger.provider';

export enum PSELanguageServiceURLTypeEnum {
    /** Translations are recovered without any discrimination. */
    Other = 'O',
    /** Translations are recovered by Language only. */
    Country = 'C',
    /** Translations are recovered by Country and Language. */
    Language = 'L'
}

export type PSELanguageServiceURL = [string, PSELanguageServiceURLTypeEnum];

export class PSELanguageServiceConfig {
    getOURLsPrefix?= () => `assets/i18n/O/`;
    getCURLsPrefix?= (language: string) => `assets/i18n/C/${language}/`;
    getLURLsPrefix?= (language: string) => `assets/i18n/L/${language}/`;
}

@Injectable()
export class PSELanguageService implements TranslateLoader, MissingTranslationHandler {

    private readonly setRelativeOURLs = new Set<string>();
    private readonly setRelativeCURLs = new Set<string>();
    private readonly setRelativeLURLs = new Set<string>();
    private readonly setAbsoluteURLs = new Set<string>();
    private readonly mapJSON = new Map<string, any>();

    constructor(
        private readonly httpClient: HttpClient,
        @Optional() private readonly config?: PSELanguageServiceConfig
    ) { }

    public getTranslation(language: string): Observable<any> {
        const prefixO = this.config?.getOURLsPrefix ? this.config.getOURLsPrefix() : null;
        const prefixC = this.config?.getCURLsPrefix ? this.config.getCURLsPrefix(language) : null;
        const prefixL = this.config?.getLURLsPrefix ? this.config.getLURLsPrefix(language) : null;
        return zip(
            this.mapJSON.has(language) ? of(this.mapJSON.get(language)) : of(null),
            ...(prefixO ? Array.from(this.setRelativeOURLs.values()).map((relativeURL) => this.getJSON(prefixO + relativeURL)) : []),
            ...(prefixC ? Array.from(this.setRelativeCURLs.values()).map((relativeURL) => this.getJSON(prefixC + relativeURL)) : []),
            ...(prefixL ? Array.from(this.setRelativeLURLs.values()).map((relativeURL) => this.getJSON(prefixL + relativeURL)) : [])
        ).pipe(
            map((results) => PSEMergerProvider.merger(...results.filter((result => result !== null)))),
            tap((JSON) => this.mapJSON.set(language, JSON))
        );
    }

    public handle(params: MissingTranslationHandlerParams) {
        return params.key;
    }

    //

    public addURLs(URLs: Array<PSELanguageServiceURL>): void {
        URLs.forEach(([value, type]) => {
            switch (type) {
                case PSELanguageServiceURLTypeEnum.Other: return this.setRelativeOURLs.add(value);
                case PSELanguageServiceURLTypeEnum.Country: return this.setRelativeCURLs.add(value);
                case PSELanguageServiceURLTypeEnum.Language: return this.setRelativeLURLs.add(value);
            }
        });
    }

    //

    private getJSON(absoluteURL: string): Observable<any> {
        return this.setAbsoluteURLs.has(absoluteURL) ? of(null) : this.httpClient.get<any>(absoluteURL).pipe(
            map((JSON) => {
                delete JSON['$schema'];
                this.setAbsoluteURLs.add(absoluteURL);
                return JSON;
            }),
            catchError(_ => {
                return of(null);
            })
        );
    }

}
