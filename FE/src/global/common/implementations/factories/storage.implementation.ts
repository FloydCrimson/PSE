export interface StorageImplementation<T> {
    ready(): Promise<boolean>;
    set<K extends keyof T>(key: K, data: T[K]): Promise<boolean>;
    get<K extends keyof T>(key: K): Promise<T[K]>;
    remove<K extends keyof T>(key: K): Promise<boolean>;
    clear(): Promise<boolean>;
}
