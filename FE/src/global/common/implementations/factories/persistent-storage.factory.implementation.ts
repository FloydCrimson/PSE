export interface PersistentStorageFactoryImplementation<T> {
    ready(): Promise<boolean>;
    set<K extends keyof T>(key: K, data: T[K]): Promise<void>;
    update<K extends keyof T>(key: K, pdata: Partial<T[K]>): Promise<void>;
    get<K extends keyof T>(key: K): Promise<T[K]>;
    remove<K extends keyof T>(key: K): Promise<void>;
    clear(): Promise<void>;
}
