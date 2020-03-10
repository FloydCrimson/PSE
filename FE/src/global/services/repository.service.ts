import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { exhaustMap, take, timeout, tap, catchError, finalize, skip } from 'rxjs/operators';

import { RepositoryFactory } from 'global/factories/repository.factory';
import { RepositoryFactoryTypes } from 'global/factories/repository.factory.type';
import { EndpointImplementation } from 'global/common/implementations/endpoint.implementation';
import { RequestImplementation } from 'global/common/implementations/request.implementation';
import { ResponseImplementation } from 'global/common/implementations/response.implementation';
import { ErrorImplementation } from 'global/common/implementations/error.implementation';
import { CoderProvider } from 'global/providers/coder.provider';

@Injectable({
    providedIn: 'root'
})
export class RepositoryService {

    private cache: Map<string, Map<string, [BehaviorSubject<{ response?: ResponseImplementation<any>; error?: ErrorImplementation; success: boolean; }>, number]>>;

    constructor(
        private readonly repositoryFactory: RepositoryFactory
    ) {
        this.cache = new Map<string, Map<string, [BehaviorSubject<{ response?: ResponseImplementation<any>; error?: ErrorImplementation; success: boolean; }>, number]>>();
    }

    public call<K extends keyof RepositoryFactoryTypes, B, P, O>(type: K, endpoint: EndpointImplementation<B, P, O>, request: RequestImplementation<B, P>): Observable<{ response?: ResponseImplementation<O>; error?: ErrorImplementation; success: boolean; }> {
        const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
        const hashRequest: string = this.generateHashRequest(request);
        let map = this.cache.get(hashEndpoint);
        if (!map) {
            map = new Map<string, [BehaviorSubject<{ response?: ResponseImplementation<O>; error?: ErrorImplementation; success: boolean; }>, number]>();
            this.cache.set(hashEndpoint, map);
        }
        let array = map.get(hashRequest);
        if (!array) {
            array = [new BehaviorSubject<{ response?: ResponseImplementation<O>; error?: ErrorImplementation; success: boolean; }>({ success: true }), 0];
            map.set(hashRequest, array);
        }
        if (request.options.cached && array[0].getValue().response) {
            return array[0].asObservable().pipe(
                exhaustMap(response => {
                    delete response.error;
                    response.success = true;
                    return of(response);
                }),
                take(1)
            );
        } if (!request.options.wait || array[1] === 0) {
            array[1]++;
            this.repositoryFactory.get(type).call(endpoint, request).pipe(
                timeout(endpoint.timeout || 60000),
                tap(response => {
                    const map = this.cache.get(hashEndpoint);
                    const array = map.get(hashRequest);
                    array[0].next({ response, success: true });
                }),
                catchError(error => {
                    if (!('error' in error) || !('statusCode' in error)) {
                        error = { error: error, statusCode: -1 } as ErrorImplementation;
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

    public clearEndpointCache<K extends keyof RepositoryFactoryTypes, B, P, O>(type: K, endpoint: EndpointImplementation<B, P, O>): void {
        const hashEndpoint: string = this.generateHashEndpoint(type, endpoint);
        const map = this.cache.get(hashEndpoint);
        if (map) {
            map.clear();
            this.cache.delete(hashEndpoint);
        }
    }

    public clearAllCache(): void {
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

    private generateHashEndpoint<K extends keyof RepositoryFactoryTypes, B, P, O>(type: K, endpoint: EndpointImplementation<B, P, O>): string {
        return CoderProvider.encode(type + endpoint.method + endpoint.url);
    }

    private generateHashRequest<B, P>(request: RequestImplementation<B, P>): string {
        return CoderProvider.encode(JSON.stringify(request.input));
    }

}
