import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { exhaustMap, take, timeout, tap, catchError, finalize, skip } from 'rxjs/operators';

import { RestFactory } from 'global/factories/rest.factory';
import { RestFactoryTypes } from 'global/factories/rest.factory.type';
import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';
import { RequestRestImplementation } from 'global/common/implementations/request-rest.implementation';
import { ResponseRestImplementation } from 'global/common/implementations/response-rest.implementation';
import { ErrorRestImplementation } from 'global/common/implementations/error-rest.implementation';
import { CoderProvider } from 'global/providers/coder.provider';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    private cache: Map<string, Map<string, [BehaviorSubject<{ response?: ResponseRestImplementation<any>; error?: ErrorRestImplementation; success: boolean; }>, number]>>;

    constructor(
        private readonly restFactory: RestFactory
    ) {
        this.cache = new Map<string, Map<string, [BehaviorSubject<{ response?: ResponseRestImplementation<any>; error?: ErrorRestImplementation; success: boolean; }>, number]>>();
    }

    public getRequest<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): RequestRestImplementation<B, P> {
        const request: RequestRestImplementation<B, P> = { input: { body: undefined, params: undefined }, options: { cached: false, wait: true } };
        return request;
    }

    public getResponse<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): ResponseRestImplementation<O> {
        const response: ResponseRestImplementation<O> = { output: undefined, statusCode: -1 };
        return response;
    }

    public call<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): Observable<{ response?: ResponseRestImplementation<O>; error?: ErrorRestImplementation; success: boolean; }> {
        const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
        const hashRequest: string = this.generateHashRequest(request);
        let map = this.cache.get(hashEndpoint);
        if (!map) {
            map = new Map<string, [BehaviorSubject<{ response?: ResponseRestImplementation<O>; error?: ErrorRestImplementation; success: boolean; }>, number]>();
            this.cache.set(hashEndpoint, map);
        }
        let array = map.get(hashRequest);
        if (!array) {
            array = [new BehaviorSubject<{ response?: ResponseRestImplementation<O>; error?: ErrorRestImplementation; success: boolean; }>({ success: true }), 0];
            map.set(hashRequest, array);
        }
        if (request.options.cached && array[0].getValue().response) {
            return array[0].asObservable().pipe(
                take(1),
                exhaustMap(response => {
                    delete response.error;
                    response.success = true;
                    return of(response);
                })
            );
        }
        if (!request.options.wait || array[1] === 0) {
            array[1]++;
            this.restFactory.get(type).call(endpoint, request).pipe(
                timeout(endpoint.timeout || 60000),
                tap(response => {
                    const map = this.cache.get(hashEndpoint);
                    const array = map.get(hashRequest);
                    array[0].next({ response, success: true });
                }),
                catchError(error => {
                    if (!('error' in error) || !('statusCode' in error)) {
                        error = { error: error, statusCode: -1 } as ErrorRestImplementation;
                    }
                    array[0].next({ response: array[0].getValue().response, error, success: false });
                    return throwError(error);
                }),
                finalize(() => array[1]--)
            ).subscribe();
        }
        return array[0].asObservable().pipe(
            skip(1),
            take(1)
        );
    }

    public isCallCached<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): boolean {
        const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
        const hashRequest: string = this.generateHashRequest(request);
        let map = this.cache.get(hashEndpoint);
        if (!map) {
            return false;
        }
        let array = map.get(hashRequest);
        if (!array) {
            return false;
        }
        return !!array[0].getValue().response;
    }

    public clearCache(): void {
        for (const hashEndpoint of this.cache.keys()) {
            const map = this.cache.get(hashEndpoint);
            if (map) {
                map.clear();
                this.cache.delete(hashEndpoint);
            }
        }
        this.cache.clear();
    }

    //

    private generateHashEndpoint<K extends keyof RestFactoryTypes, B, P, O>(type: K, endpoint: EndpointRestImplementation<B, P, O>): string {
        return `${type}:${endpoint.method}/${endpoint.url}`;
    }

    private generateHashRequest<B, P>(request: RequestRestImplementation<B, P>): string {
        return CoderProvider.encode(JSON.stringify(request.input));
    }

}
