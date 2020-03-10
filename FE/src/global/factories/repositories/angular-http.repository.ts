import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as hawk from '@hapi/hawk';

import { domain } from '@domains/domain';

import { RepositoryImplementation } from 'global/common/implementations/factories/repository.implementation';
import { EndpointImplementation } from 'global/common/implementations/endpoint.implementation';
import { RequestImplementation } from 'global/common/implementations/request.implementation';
import { ResponseImplementation } from 'global/common/implementations/response.implementation';
import { ErrorImplementation } from 'global/common/implementations/error.implementation';
import { NonceProvider } from 'global/providers/nonce.provider';
import { CoderProvider } from 'global/providers/coder.provider';

export class AngularHttpRepository implements RepositoryImplementation {

    // Chrome

    private readonly id: string = 'dh37fgj492je';
    private readonly key: string = 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn';
    private readonly algorithm: 'sha256' | 'sha1' = 'sha256';

    constructor(
        private readonly http: HttpClient
    ) { }

    public call<B, P, O>(endpoint: EndpointImplementation<B, P, O>, request: RequestImplementation<B, P>): Observable<ResponseImplementation<O>> {
        request.input = request.input || { body: undefined, params: undefined };
        request.input.body = request.input.body || {} as B;
        request.input.params = request.input.params || {} as P;
        const method: (url: string, headers: HttpHeaders, input: { body: B, params: P }) => Observable<HttpResponse<O>> = this.getMethod(endpoint);
        const url: string = `${domain.protocol}://${domain.url}:${domain.port}${endpoint.url}`;
        const credentials = { id: this.id, key: this.key, algorithm: this.algorithm };
        let headers: HttpHeaders = new HttpHeaders();
        let artifacts;
        if (endpoint.auth) {
            const timestamp: number = Math.floor(Date.now() / 1000);
            const nonce: string = NonceProvider.generate(this.key, timestamp);
            const options = { credentials, timestamp, nonce, payload: JSON.stringify(request.input.body), contentType: 'application/json' };
            const output = hawk.client.header(url, endpoint.method, options);
            artifacts = output.artifacts;
            headers = headers.set('Authorization', output.header);
        }
        return method(url, headers, request.input).pipe(
            map((result: HttpResponse<O>) => {
                if (endpoint.auth) {
                    const options = { payload: JSON.stringify(result.body), required: true };
                    const output = hawk.client.authenticate(result, credentials, artifacts, options);
                    if (!output) {
                        throw 'Server not recognized';
                    }
                }
                const response: ResponseImplementation<O> = { output: result.body, statusCode: result.status };
                return response;
            }),
            catchError(error => {
                return throwError({ error: error, statusCode: error.status || -1 } as ErrorImplementation);
            })
        );
    }

    //

    private getMethod<B, P, O>(endpoint: EndpointImplementation<B, P, O>): (url: string, headers: HttpHeaders, input: { body: B, params: P }) => Observable<HttpResponse<O>> {
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
