import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export class JSStorage<T> implements StorageFactoryImplementation<T> {

    private storage: Map<keyof T, T[keyof T]> = new Map<keyof T, T[keyof T]>();

    constructor() { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.set(key, data);
            resolve();
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            const data = this.storage.get(key);
            resolve(<T[K]>data);
        });
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.delete(key);
            resolve();
        });
    }

    public clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.clear();
            resolve();
        });
    }

}
