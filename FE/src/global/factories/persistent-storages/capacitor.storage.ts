import { Storage as CapacitorStoragePlugin } from '@capacitor/storage';

import { PersistentStorageFactoryImplementation } from 'global/common/implementations/factories/persistent-storage.factory.implementation';

export class CapacitorStorage<T> implements PersistentStorageFactoryImplementation<T> {

    constructor() { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return CapacitorStoragePlugin.set({ key: key as string, value: JSON.stringify(data) });
    }

    public update<K extends keyof T>(key: K, pdata: Partial<T[K]>): Promise<void> {
        return this.get(key).then((data) => this.set(key, { ...data, ...pdata }));
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return CapacitorStoragePlugin.get({ key: key as string }).then((resolved) => <T[K]>JSON.parse(resolved.value));
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return CapacitorStoragePlugin.remove({ key: key as string });
    }

    public clear(): Promise<void> {
        return CapacitorStoragePlugin.clear();
    }

}
