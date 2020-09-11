import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, timeout, tap, skip } from 'rxjs/operators';

import { FChanFactory } from 'global/factories/fchan.factory';

import { FChanFactoryImplementation } from 'global/common/implementations/factories/fchan.factory.implementation';

@Injectable({
    providedIn: 'root'
})
export class FChanService {

    private cache = new Map<string, BehaviorSubject<{ success: boolean; response: any; }>>();
    private fchanFactoryImplemented = this.fchanFactory.get('API');

    constructor(
        private readonly fchanFactory: FChanFactory
    ) { }

    public call(cache: boolean): <K extends keyof FChanFactoryImplementation>(method: K, ...params: Parameters<FChanFactoryImplementation[K]>) => ReturnType<FChanFactoryImplementation[K]> {
        return <K extends keyof FChanFactoryImplementation>(method: K, ...params: Parameters<FChanFactoryImplementation[K]>) => {
            const key = method + '=' + JSON.stringify(params);
            if (!this.cache.has(key)) {
                this.cache.set(key, new BehaviorSubject<{ success: boolean; response: any; }>(null));
            }
            const behavior = this.cache.get(key);
            return this.cacher(behavior, this.fchanFactoryImplemented[method].call(this.fchanFactoryImplemented, ...params), cache) as ReturnType<FChanFactoryImplementation[K]>;
        };
    }

    public cached<K extends keyof FChanFactoryImplementation>(method: K, ...params: Parameters<FChanFactoryImplementation[K]>): boolean {
        const key = method + '=' + JSON.stringify(params);
        return this.cache.has(key);
    }

    // private

    private cacher<T extends { success: boolean; }>(behavior: BehaviorSubject<T>, observable: Observable<T>, cache: boolean): Observable<T> {
        const value = behavior.getValue();
        if (cache && value !== null && value.success) {
            return behavior.asObservable().pipe(
                take(1)
            );
        } else {
            observable.pipe(
                timeout(60000),
                tap((result) => behavior.next(result))
            ).subscribe();
            return behavior.asObservable().pipe(
                skip(1),
                take(1)
            );
        }
    }

}
