import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { Observable, zip, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { PSEMergerProvider } from '../providers/merger.provider';

export class PSELanguageServiceConfig {
    getURLsPrefix = (language: string) => `assets/i18n/${language}/`;
}

@Injectable()
export class PSELanguageService implements TranslateLoader, MissingTranslationHandler {

    private readonly setRelativeURLs = new Set<string>();
    private readonly setAbsoluteURLs = new Set<string>();
    private readonly mapJSON = new Map<string, Object>();

    constructor(
        private readonly httpClient: HttpClient,
        @Optional() private readonly config?: PSELanguageServiceConfig
    ) { }

    public handle(params: MissingTranslationHandlerParams) {
        return params.key;
    }

    public getTranslation(language: string): Observable<any> {
        const prefix = this.config ? this.config.getURLsPrefix(language) : `assets/i18n/${language}/`;
        return zip(
            this.mapJSON.has(language) ? of(this.mapJSON.get(language)) : of(null),
            ...Array.from(this.setRelativeURLs.values()).map((relativeURL) => this.getJSON(prefix + relativeURL))
        ).pipe(
            map((results) => PSEMergerProvider.merger(...results.filter((result => result !== null)))),
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
            map((JSON: any) => {
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
