import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { RestFactoryImplementation } from 'global/common/implementations/factories/rest.factory.implementation';
import { ErrorRestImplementation } from 'global/common/implementations/error-rest.implementation';
import { CoderProvider } from 'global/providers/coder.provider';

export class NativeRest implements RestFactoryImplementation {

    constructor(
        private readonly http: HTTP
    ) {
        this.http.setDataSerializer('json');
    }

    public get<B, P, O>(url: string, headers: { [key: string]: string; }, input: { body: B; params: P; }): Observable<{ status: number; headers: { [key: string]: string; }; output: { data: O; }; }> {
        const params = Object.keys(input.params).length > 0 ? { params: CoderProvider.encode(JSON.stringify(input.params)) } : undefined;
        const method = from(this.http.get(url, params, headers));
        return this.manage(method);
    }

    public post<B, P, O>(url: string, headers: { [key: string]: string; }, input: { body: B; params: P; }): Observable<{ status: number; headers: { [key: string]: string; }; output: { data: O; }; }> {
        const params = Object.keys(input.params).length > 0 ? { params: CoderProvider.encode(JSON.stringify(input.params)) } : undefined;
        const method = from(this.http.post(url + (params ? `?params=${params.params}` : ''), input.body, headers));
        return this.manage(method);
    }

    //

    private manage<B, P, O>(method: Observable<HTTPResponse>): Observable<{ status: number; headers: { [key: string]: string; }; output: { data: O; }; }> {
        return method.pipe(
            map((response: HTTPResponse) => {
                try {
                    return { status: response.status, headers: response.headers, output: { data: JSON.parse(response.data) } };
                } catch (error) {
                    return { status: response.status, headers: response.headers, output: { data: response.data } };
                }
            }),
            catchError((error) => {
                try {
                    return throwError({ error: { ...error, error: JSON.parse(error.error) }, status: error.status } as ErrorRestImplementation);
                } catch (error) {
                    return throwError({ error, status: error.status } as ErrorRestImplementation);
                }
            })
        );
    }

}
