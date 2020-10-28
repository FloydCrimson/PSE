import { StoragePlugin } from '@capacitor/core';

import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export class CapacitorStorage<T> implements StorageFactoryImplementation<T, Promise<any>> {

    constructor(
        private readonly storagePlugin: StoragePlugin
    ) { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return this.storagePlugin.set({ key: key as string, value: JSON.stringify(data) });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return this.storagePlugin.get({ key: key as string }).then((resolved) => <T[K]>JSON.parse(resolved.value));
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return this.storagePlugin.remove({ key: key as string });
    }

    public clear(): Promise<void> {
        return this.storagePlugin.clear();
    }

}
