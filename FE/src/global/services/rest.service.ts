import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable, throwError, TimeoutError, timer } from 'rxjs';
import { take, catchError, finalize, skip, map, switchMap } from 'rxjs/operators';
import * as hawk from '@hapi/hawk';

import { domain } from '@domains/domain';

import { RestFactory } from 'global/factories/rest.factory';
import { EphemeralStorageFactory } from 'global/factories/ephemeral-storages.factory';
import { RestFactoryTypes } from 'global/factories/rest.factory.type';
import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';
import { RequestRestImplementation } from 'global/common/implementations/request-rest.implementation';
import { ResponseRestImplementation } from 'global/common/implementations/response-rest.implementation';
import { ErrorRestImplementation } from 'global/common/implementations/error-rest.implementation';
import { CoderProvider } from 'global/providers/coder.provider';
import { CrypterProvider } from 'global/providers/crypter.provider';
import { NonceProvider } from 'global/providers/nonce.provider';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    private cache: Map<string, Map<string, [BehaviorSubject<{ response?: ResponseRestImplementation<any>; error?: ErrorRestImplementation; success: boolean; }>, number]>>;

    constructor(
        private readonly restFactory: RestFactory,
        private readonly eStorageFactory: EphemeralStorageFactory
    ) {
        this.cache = new Map<string, Map<string, [BehaviorSubject<{ response?: ResponseRestImplementation<any>; error?: ErrorRestImplementation; success: boolean; }>, number]>>();
    }

    public getRequest<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): RequestRestImplementation<B, P> {
        const request: RequestRestImplementation<B, P> = { input: { body: undefined, params: undefined }, options: { cached: false, wait: true } };
        return request;
    }

    public getResponse<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): ResponseRestImplementation<O> {
        const response: ResponseRestImplementation<O> = { output: undefined, status: undefined };
        return response;
    }

    public makeCall<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): Observable<{ response?: ResponseRestImplementation<O>; error?: ErrorRestImplementation; success: boolean; }> {
        const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
        const hashRequest: string = this.generateHashRequest(request);
        if (!this.cache.has(hashEndpoint)) {
            this.cache.set(hashEndpoint, new Map<string, [BehaviorSubject<{ response?: ResponseRestImplementation<O>; error?: ErrorRestImplementation; success: boolean; }>, number]>());
        }
        const mapEndpoint = this.cache.get(hashEndpoint);
        if (!mapEndpoint.has(hashRequest)) {
            mapEndpoint.set(hashRequest, [new BehaviorSubject<{ response?: ResponseRestImplementation<O>; error?: ErrorRestImplementation; success: boolean; }>({ success: true }), 0]);
        }
        const mapRequest = mapEndpoint.get(hashRequest);
        if (request.options.cached && mapRequest[0].getValue().response) {
            return mapRequest[0].asObservable().pipe(
                take(1),
                map((response) => { return { ...response, error: undefined, success: true }; })
            );
        }
        if (!request.options.wait || mapRequest[1] === 0) {
            mapRequest[1]++;
            merge(
                timer(endpoint.timeout || 60000).pipe(switchMap(_ => throwError({ error: new TimeoutError(), status: 408 } as ErrorRestImplementation))),
                this.callMethod(type, endpoint, request)
            ).pipe(
                take(1),
                finalize(() => mapRequest[1]--)
            ).subscribe((response) => {
                mapRequest[0].next({ response, error: undefined, success: true });
            }, (error: ErrorRestImplementation) => {
                if (mapRequest[1] === 1) {
                    mapRequest[0].next({ response: mapRequest[0].getValue().response, error, success: false });
                }
            });
        }
        return mapRequest[0].asObservable().pipe(
            skip(1),
            take(1)
        );
    }

    public isCallCached<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): boolean {
        const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
        const hashRequest: string = this.generateHashRequest(request);
        if (!this.cache.has(hashEndpoint)) {
            return false;
        }
        const mapEndpoint = this.cache.get(hashEndpoint);
        if (!mapEndpoint.has(hashRequest)) {
            return false;
        }
        const mapRequest = mapEndpoint.get(hashRequest);
        return !!mapRequest[0].getValue().response;
    }

    public clearCache(): void;
    public clearCache<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): void;
    public clearCache(...args: any[]): void {
        if (args.length === 0) {
            for (const hashEndpoint of this.cache.keys()) {
                const mapEndpoint = this.cache.get(hashEndpoint);
                if (mapEndpoint) {
                    mapEndpoint.clear();
                    this.cache.delete(hashEndpoint);
                }
            }
            this.cache.clear();
        } else if (args.length === 2) {
            const [type, endpoint] = args;
            const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
            const mapEndpoint = this.cache.get(hashEndpoint);
            if (mapEndpoint) {
                mapEndpoint.clear();
                this.cache.delete(hashEndpoint);
            }
        }
    }

    //

    private generateHashEndpoint<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): string {
        return `${type}:${endpoint.method}-${endpoint.url}`;
    }

    private generateHashRequest<B, P>(request: RequestRestImplementation<B, P>): string {
        return CrypterProvider.hash(JSON.stringify(request.input));
    }

    private callMethod<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): Observable<ResponseRestImplementation<O>> {
        const auth = (endpoint.auth !== 'none') ? this.eStorageFactory.get('In').get('auth') : undefined;
        request.input = request.input || { body: undefined, params: undefined };
        request.input.body = request.input.body || {} as B;
        request.input.params = request.input.params || {} as P;
        const protocol = domain.protocols['rest'];
        const url: string = `${protocol.secure ? 'https' : 'http'}://${protocol.url}:${protocol.port}${endpoint.url}`;
        const credentials = auth ? { id: CoderProvider.encode(JSON.stringify({ [auth.type]: auth.value })), key: auth.key, algorithm: auth.algorithm } : undefined;
        let headers: { [key: string]: string } = {};
        let artifacts;
        if (endpoint.auth === 'partial') {
            const timestamp: number = Math.floor(Date.now() / 1000);
            const nonce: string = NonceProvider.generate(credentials.key, timestamp);
            headers['Authorization'] = `Hawk id="${credentials.id}", ts="${timestamp}", nonce="${nonce}"`;
        } else if (endpoint.auth === 'full') {
            const timestamp: number = Math.floor(Date.now() / 1000);
            const nonce: string = NonceProvider.generate(credentials.key, timestamp);
            const options = { credentials, timestamp, nonce, payload: JSON.stringify(request.input), contentType: 'application/json' };
            const output = hawk.client.header(url, endpoint.method, options);
            artifacts = output.artifacts;
            headers['Authorization'] = output.header;
        }
        return this.getMethod(type, endpoint, url, headers, request.input).pipe(
            map((result) => {
                if (endpoint.auth === 'full') {
                    const options = { payload: JSON.stringify(result.output.data), required: true };
                    const output = hawk.client.authenticate(result, credentials, artifacts, options);
                    if (!output) {
                        throw 'Server not recognized.';
                    }
                }
                const response: ResponseRestImplementation<O> = { output: result.output.data, status: result.status };
                return response;
            }),
            catchError(error => {
                return throwError({ error: error, status: error.status } as ErrorRestImplementation);
            })
        );
    }

    private getMethod<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>, url: string, headers: { [key: string]: string; }, input: { body: B; params: P; }): Observable<{ status: number; headers: { [key: string]: string }; output: { data: O; }; }> {
        if (endpoint.method === 'GET') {
            return this.restFactory.get(type).get(url, headers, input);
        } else if (endpoint.method === 'POST') {
            return this.restFactory.get(type).post(url, headers, input);
        } else {
            throw 'Invalid method "' + endpoint.method + '" found.';
        }
    }

}
