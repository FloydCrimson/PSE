import { Observable } from 'rxjs';

export interface StorageFactoryImplementation<T, R = unknown> {
    ready(): Asynchify<R, boolean>;
    set<K extends keyof T>(key: K, data: T[K]): Asynchify<R, void>;
    get<K extends keyof T>(key: K): Asynchify<R, T[K]>;
    remove<K extends keyof T>(key: K): Asynchify<R, void>;
    clear(): Asynchify<R, void>;
}

type Asynchify<R, T> = R extends Promise<any> ? Promise<T> : (R extends Observable<any> ? Observable<T> : T);
