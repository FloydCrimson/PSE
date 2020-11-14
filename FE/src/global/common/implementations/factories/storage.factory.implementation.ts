import { Observable } from 'rxjs';

export interface StorageSyncFactoryImplementation<T> {
    ready(): boolean;
    set<K extends keyof T>(key: K, data: T[K]): void;
    get<K extends keyof T>(key: K): T[K];
    remove<K extends keyof T>(key: K): void;
    clear(): void;
}

export interface StorageAsyncFactoryImplementation<A> {
    ready(): AsynchifyG<A, boolean>;
    set<K extends keyof Synchify<A>>(key: K, data: Synchify<A>[K]): AsynchifyG<A, void>;
    get<K extends keyof Synchify<A>>(key: K): AsynchifyG<A, Synchify<A>[K]>;
    remove<K extends keyof Synchify<A>>(key: K): AsynchifyG<A, void>;
    clear(): AsynchifyG<A, void>;
}

type Synchify<A> = A extends Promise<infer T> ? T : (A extends Observable<infer T> ? T : unknown);
type AsynchifyG<A, T> = A extends Promise<any> ? Promise<T> : (A extends Observable<any> ? Observable<T> : unknown);
