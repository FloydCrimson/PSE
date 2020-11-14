import { Storage } from '@ionic/storage';

import { PersistentStorageFactoryImplementation } from 'global/common/implementations/factories/persistent-storage.factory.implementation';

export class IonicStorage<T> implements PersistentStorageFactoryImplementation<T> {

    constructor(
        private readonly storage: Storage
    ) { }

    public ready(): Promise<boolean> {
        return this.storage.ready().then(_ => true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return this.storage.set(key as string, data).then();
    }

    public update<K extends keyof T>(key: K, pdata: Partial<T[K]>): Promise<void> {
        return this.get(key).then((data) => this.set(key, { ...data, ...pdata }));
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return this.storage.get(key as string).then((resolved) => <T[K]>resolved);
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return this.storage.remove(key as string).then();
    }

    public clear(): Promise<void> {
        return this.storage.clear();
    }

}
