import { EphemeralStorageFactoryImplementation } from 'global/common/implementations/factories/ephemeral-storage.factory.implementation';

export class JSStorage<T> implements EphemeralStorageFactoryImplementation<T> {

    private storage: Map<keyof T, any>;

    constructor() { }

    public ready(): boolean {
        this.storage = new Map<keyof T, any>();
        return true;
    }

    public set<K extends keyof T>(key: K, data: T[K]): void {
        this.storage.set(key, data);
    }

    public update<K extends keyof T>(key: K, pdata: Partial<T[K]>): void {
        const data = this.get(key);
        this.set(key, { ...data, ...pdata });
    }

    public get<K extends keyof T>(key: K): T[K] {
        return <T[K]>this.storage.get(key);
    }

    public remove<K extends keyof T>(key: K): void {
        this.storage.delete(key);
    }

    public clear(): void {
        this.storage.clear();
    }

}
