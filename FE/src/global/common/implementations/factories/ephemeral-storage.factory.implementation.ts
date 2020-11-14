export interface EphemeralStorageFactoryImplementation<T> {
    ready(): boolean;
    set<K extends keyof T>(key: K, data: T[K]): void;
    update<K extends keyof T>(key: K, pdata: Partial<T[K]>): void;
    get<K extends keyof T>(key: K): T[K];
    remove<K extends keyof T>(key: K): void;
    clear(): void;
}
