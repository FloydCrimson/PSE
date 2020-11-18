import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CoderProvider } from 'pse-global-providers';

import { RestFactoryImplementation } from 'global/common/implementations/factories/rest.factory.implementation';
import { ErrorRestImplementation } from 'global/common/implementations/error-rest.implementation';

export class AngularRest implements RestFactoryImplementation {

    constructor(
        private readonly http: HttpClient
    ) { }

    public get<B, P, O>(url: string, headers: { [key: string]: string; }, input: { body: B; params: P; }): Observable<{ status: number; headers: { [key: string]: string; }; output: { data: O; }; }> {
        const params = Object.keys(input.params).length > 0 ? { params: CoderProvider.encode(JSON.stringify(input.params)) } : undefined;
        const method = this.http.get<O>(url, { observe: 'response', responseType: 'json', headers: headers, params });
        return this.manage(method);
    }

    public post<B, P, O>(url: string, headers: { [key: string]: string; }, input: { body: B; params: P; }): Observable<{ status: number; headers: { [key: string]: string; }; output: { data: O; }; }> {
        const params = Object.keys(input.params).length > 0 ? { params: CoderProvider.encode(JSON.stringify(input.params)) } : undefined;
        const method = this.http.post<O>(url, input.body, { observe: 'response', headers: headers, params });
        return this.manage(method);
    }

    //

    private manage<B, P, O>(method: Observable<HttpResponse<O>>): Observable<{ status: number; headers: { [key: string]: string; }; output: { data: O; }; }> {
        return method.pipe(
            map((response: HttpResponse<O>) => {
                return {
                    status: response.status,
                    headers: response.headers.keys().reduce((headers, name) => {
                        headers[name] = response.headers.get(name);
                        return headers;
                    }, {}),
                    output: { data: response.body }
                };
            }),
            catchError(error => {
                return throwError({ error: error, status: error.status } as ErrorRestImplementation);
            })
        );
    }

}
