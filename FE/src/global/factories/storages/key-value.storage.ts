import { NativeStoragePluginImplementation } from 'global/common/implementations/plugins/native-storage.plugin.implementation';

import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export class KeyValueStorage<T> implements StorageFactoryImplementation<T> {

    constructor(
        private readonly nativeStoragePlugin: NativeStoragePluginImplementation
    ) { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.nativeStoragePlugin.setItem(key as string, data, (success) => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            this.nativeStoragePlugin.getItem(key as string, (success) => {
                resolve(success as T[K]);
            }, (error) => {
                reject(error);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.nativeStoragePlugin.remove(key as string, (success) => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

    public clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.nativeStoragePlugin.clear((success) => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

}
