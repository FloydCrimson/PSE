import { NativeStoragePluginImplementation } from 'global/common/implementations/plugins/native-storage.plugin.implementation';

import { StorageImplementation } from 'global/common/implementations/factories/storage.implementation';

export class KeyValueStorage<T> implements StorageImplementation<T> {

    constructor(
        private readonly nativeStoragePlugin: NativeStoragePluginImplementation
    ) { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.nativeStoragePlugin.setItem(<string>key, data, (success) => {
                resolve(true);
            }, (error) => {
                reject(error);
            });
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            this.nativeStoragePlugin.getItem(<string>key, (success) => {
                resolve(<T[K]>success);
            }, (error) => {
                reject(error);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.nativeStoragePlugin.remove(<string>key, (success) => {
                resolve(true);
            }, (error) => {
                reject(error);
            });
        });
    }

    public clear(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.nativeStoragePlugin.clear((success) => {
                resolve(true);
            }, (error) => {
                reject(error);
            });
        });
    }

}
