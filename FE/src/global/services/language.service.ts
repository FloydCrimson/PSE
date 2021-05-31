import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader } from '@ngx-translate/core';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MergerProvider } from 'pse-global-providers';

import { CountryConfig } from '@countries/country';

@Injectable({
    providedIn: 'root'
})
export class LanguageService implements TranslateLoader, MissingTranslationHandler {

    private readonly setRelativeURLs = new Set<string>();
    private readonly setAbsoluteURLs = new Set<string>();
    private readonly mapJSON = new Map<string, Object>();

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    public handle(params: MissingTranslationHandlerParams) {
        return params.key;
    }

    public getTranslation(language: string): Observable<any> {
        const prefix = `assets/${CountryConfig.country}/i18n/${language}/`;
        return zip(
            this.mapJSON.has(language) ? of(this.mapJSON.get(language)) : of(null),
            ...Array.from(this.setRelativeURLs.values()).map((relativeURL) => this.getJSON(prefix + relativeURL))
        ).pipe(
            map((results) => MergerProvider.merger(...results.filter((result => result !== null)))),
            tap((JSON) => this.mapJSON.set(language, JSON))
        );
    }

    //

    public addURLs(URLs: string[]): void {
        URLs.forEach((URL) => this.setRelativeURLs.add(URL));
    }

    //

    private getJSON(absoluteURL: string): Observable<any> {
        return this.setAbsoluteURLs.has(absoluteURL) ? of(null) : this.httpClient.get(absoluteURL).pipe(
            map((JSON) => {
                delete JSON['$schema'];
                console.log('Asset "' + absoluteURL + '" loaded.', JSON);
                this.setAbsoluteURLs.add(absoluteURL);
                return JSON;
            }),
            catchError((error) => {
                console.error(error);
                return of(null);
            })
        );
    }

}
