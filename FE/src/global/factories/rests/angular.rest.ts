import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import * as hawk from '@hapi/hawk';

import { domain } from '@domains/domain';

import { RestFactoryImplementation } from 'global/common/implementations/factories/rest.factory.implementation';
import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';
import { RequestRestImplementation } from 'global/common/implementations/request-rest.implementation';
import { ResponseRestImplementation } from 'global/common/implementations/response-rest.implementation';
import { ErrorRestImplementation } from 'global/common/implementations/error-rest.implementation';
import { StorageFactory } from 'global/factories/storage.factory';
import { NonceProvider } from 'global/providers/nonce.provider';
import { CoderProvider } from 'global/providers/coder.provider';

export class AngularRest implements RestFactoryImplementation {

    constructor(
        private readonly http: HttpClient,
        private readonly storageFactory: StorageFactory
    ) { }

    public call<B, P, O>(endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): Observable<ResponseRestImplementation<O>> {
        return from(endpoint.auth ? this.storageFactory.get('TempInData').get('auth') : of(undefined)).pipe(
            exhaustMap((auth) => {
                request.input = request.input || { body: undefined, params: undefined };
                request.input.body = request.input.body || {} as B;
                request.input.params = request.input.params || {} as P;
                const protocol = domain.protocols['rest'];
                const method: (url: string, headers: HttpHeaders, input: { body: B, params: P }) => Observable<HttpResponse<O>> = this.getMethod(endpoint);
                const url: string = `${protocol.secure ? 'https' : 'http'}://${protocol.url}:${protocol.port}${endpoint.url}`;
                const credentials = auth ? { id: CoderProvider.encode(JSON.stringify({ [auth.type]: auth.value })), key: auth.key, algorithm: auth.algorithm } : undefined;
                let headers: HttpHeaders = new HttpHeaders();
                let artifacts;
                if (endpoint.auth && credentials) {
                    const timestamp: number = Math.floor(Date.now() / 1000);
                    const nonce: string = NonceProvider.generate(credentials.key, timestamp);
                    const options = { credentials, timestamp, nonce, payload: JSON.stringify(request.input), contentType: 'application/json' };
                    const output = hawk.client.header(url, endpoint.method, options);
                    artifacts = output.artifacts;
                    headers = headers.set('Authorization', output.header);
                }
                return method(url, headers, request.input).pipe(
                    map((result: HttpResponse<O>) => {
                        if (endpoint.auth && credentials) {
                            const options = { payload: JSON.stringify(result.body), required: true };
                            const output = hawk.client.authenticate(result, credentials, artifacts, options);
                            if (!output) {
                                throw 'Server not recognized.';
                            }
                        }
                        const response: ResponseRestImplementation<O> = { output: result.body, statusCode: result.status };
                        return response;
                    }),
                    catchError(error => {
                        return throwError({ error: error, statusCode: error.status || -1 } as ErrorRestImplementation);
                    })
                );
            })
        );
    }

    //

    private getMethod<B, P, O>(endpoint: EndpointRestImplementation<B, P, O>): (url: string, headers: HttpHeaders, input: { body: B, params: P }) => Observable<HttpResponse<O>> {
        if (endpoint.method === 'GET') {
            return this.get.bind(this);
        } else if (endpoint.method === 'POST') {
            return this.post.bind(this);
        } else {
            throw 'Invalid method "' + endpoint.method + '" found.';
        }
    }

    private get<B, P, O>(url: string, headers: HttpHeaders, input: { body: B, params: P }): Observable<HttpResponse<O>> {
        const params = Object.keys(input.params).length > 0 ? { params: CoderProvider.encode(JSON.stringify(input.params)) } : undefined;
        return this.http.get<O>(url, { observe: 'response', responseType: 'json', headers: headers, params });
    }

    private post<B, P, O>(url: string, headers: HttpHeaders, input: { body: B, params: P }): Observable<HttpResponse<O>> {
        const params = Object.keys(input.params).length > 0 ? { params: CoderProvider.encode(JSON.stringify(input.params)) } : undefined;
        return this.http.post<O>(url, input.body, { observe: 'response', headers: headers, params });
    }

}