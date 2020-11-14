import { NativeStoragePluginImplementation } from 'global/common/implementations/plugins/native-storage.plugin.implementation';
import { PersistentStorageFactoryImplementation } from 'global/common/implementations/factories/persistent-storage.factory.implementation';

export class KeyValueStorage<T> implements PersistentStorageFactoryImplementation<T> {

    constructor(
        private readonly nativeStoragePlugin: NativeStoragePluginImplementation
    ) { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.nativeStoragePlugin.setItem(key as string, data, _ => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

    public update<K extends keyof T>(key: K, pdata: Partial<T[K]>): Promise<void> {
        return this.get(key).then((data) => this.set(key, { ...data, ...pdata }));
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            this.nativeStoragePlugin.getItem(key as string, (success) => {
                resolve(<T[K]>success);
            }, (error) => {
                reject(error);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.nativeStoragePlugin.remove(key as string, _ => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

    public clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.nativeStoragePlugin.clear(_ => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

}
