import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { Observable, zip, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PSEMergerProvider } from '../providers/merger.provider';

export enum PSELanguageServiceURLTypeEnum {
    /** Translations are recovered without any discrimination. */
    Omni = 'O',
    /** Translations are recovered by Language only. */
    Language = 'L',
    /** Translations are recovered by your Custom configuration and Language. */
    Custom = 'C'
}

export type PSELanguageServiceURL = [string, PSELanguageServiceURLTypeEnum];

export class PSELanguageServiceConfig {
    /** Whether or not throw an error if one or more translations are missing. If 'false' all the translations successfully recovered will be returned. */
    throwError?= false;
    /** Returns the prefix of translations without any discrimination. */
    getOmniURLsPrefix?= () => `assets/i18n/O/`;
    /** Returns the prefix of translations by Language only. */
    getLanguageURLsPrefix?= (language: string) => `assets/i18n/C/${language}/`;
    /** Returns the prefix of translations by your Custom configuration and Language. */
    getCustomURLsPrefix?= (language: string) => `assets/i18n/L/${language}/`;
}

@Injectable()
export class PSELanguageService implements TranslateLoader, MissingTranslationHandler {

    private readonly mapOfRelativeURLsSetsByType = new Map<PSELanguageServiceURLTypeEnum, Set<string>>([[PSELanguageServiceURLTypeEnum.Omni, new Set<string>()], [PSELanguageServiceURLTypeEnum.Language, new Set<string>()], [PSELanguageServiceURLTypeEnum.Custom, new Set<string>()]]);
    private readonly mapOfJSONsByAbsoluteURL = new Map<string, Object>();
    private readonly mapOfAbsoluteURLsSetsByLanguage = new Map<string, Set<string>>();
    private readonly mapOfJSONsByLanguage = new Map<string, Object>();

    constructor(
        private readonly httpClient: HttpClient,
        @Optional() private readonly config?: PSELanguageServiceConfig
    ) { }

    public getTranslation(language: string): Observable<Object> {
        if (!this.mapOfAbsoluteURLsSetsByLanguage.has(language)) {
            this.mapOfAbsoluteURLsSetsByLanguage.set(language, new Set<string>());
        }
        return zip(
            of({ success: true, JSON: this.mapOfJSONsByLanguage.has(language) ? (this.mapOfJSONsByLanguage.get(language) as Object) : null }),
            ...this.getJSONsByType(this.config?.getOmniURLsPrefix ? this.config.getOmniURLsPrefix() : null, this.mapOfRelativeURLsSetsByType.get(PSELanguageServiceURLTypeEnum.Omni) as Set<string>, this.mapOfAbsoluteURLsSetsByLanguage.get(language) as Set<string>),
            ...this.getJSONsByType(this.config?.getLanguageURLsPrefix ? this.config.getLanguageURLsPrefix(language) : null, this.mapOfRelativeURLsSetsByType.get(PSELanguageServiceURLTypeEnum.Language) as Set<string>, this.mapOfAbsoluteURLsSetsByLanguage.get(language) as Set<string>),
            ...this.getJSONsByType(this.config?.getCustomURLsPrefix ? this.config.getCustomURLsPrefix(language) : null, this.mapOfRelativeURLsSetsByType.get(PSELanguageServiceURLTypeEnum.Custom) as Set<string>, this.mapOfAbsoluteURLsSetsByLanguage.get(language) as Set<string>)
        ).pipe(
            map((results) => {
                const JSON = PSEMergerProvider.merger(...results.filter((result) => result.success && result.JSON !== null).map((results) => results.JSON));
                this.mapOfJSONsByLanguage.set(language, JSON);
                if (this.config?.throwError) {
                    const errors = results.filter((results) => !results.success).map((results) => results.JSON as string);
                    if (errors.length > 0) {
                        throw new Error('Unable to retrieve translations:   ' + errors.join(', ') + '.');
                    }
                }
                return JSON;
            })
        );
    }

    public handle(params: MissingTranslationHandlerParams) {
        return params.key;
    }

    //

    public addURLs(URLs: Array<PSELanguageServiceURL>): void {
        URLs.forEach(([relativeURL, type]) => {
            const relativeURLsSet = this.mapOfRelativeURLsSetsByType.get(type) as Set<string>;
            relativeURLsSet.add(relativeURL);
        });
    }

    //

    private getJSONsByType(prefix: string | null, relativeURLsSet: Set<string>, absoluteURLsSet: Set<string>): Array<Observable<{ success: boolean; JSON: Object | null; }>> {
        if (prefix === null) {
            return Array.from(relativeURLsSet.values()).map((relativeURL) => of({ success: false, JSON: relativeURL }));
        }
        return Array.from(relativeURLsSet.values()).map((relativeURL) => this.getJSON(absoluteURLsSet, prefix + relativeURL));
    }

    private getJSON(absoluteURLsSet: Set<string>, absoluteURL: string): Observable<{ success: boolean; JSON: Object | null; }> {
        if (absoluteURLsSet.has(absoluteURL)) {
            return of({ success: true, JSON: null });
        } else if (this.mapOfJSONsByAbsoluteURL.has(absoluteURL)) {
            absoluteURLsSet.add(absoluteURL);
            return of({ success: true, JSON: this.mapOfJSONsByAbsoluteURL.get(absoluteURL) as Object });
        } else {
            return this.httpClient.get<any>(absoluteURL).pipe(
                map((JSON) => {
                    delete JSON['$schema'];
                    this.mapOfJSONsByAbsoluteURL.set(absoluteURL, JSON);
                    absoluteURLsSet.add(absoluteURL);
                    return { success: true, JSON };
                }),
                catchError(_ => {
                    return of({ success: false, JSON: absoluteURL });
                })
            );
        }
    }

}
