import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export class BuiltInStorage<T> implements StorageFactoryImplementation<T> {

    constructor(
        private readonly nativeStorage: NativeStorage
    ) { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.nativeStorage.setItem(<string>key, data).then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            this.nativeStorage.keys().then((resolved) => {
                if (resolved.indexOf(key) >= 0) {
                    this.nativeStorage.getItem(<string>key).then((resolved) => {
                        resolve(<T[K]>resolved);
                    }, (rejected) => {
                        reject(rejected);
                    }).catch((caught) => {
                        reject(caught);
                    });
                } else {
                    resolve(undefined);
                }
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.nativeStorage.remove(<string>key).then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public clear(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.nativeStorage.clear().then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

}

// ERROR
// NATIVE_WRITE_FAILED = 1
// ITEM_NOT_FOUND = 2
// NULL_REFERENCE = 3
// UNDEFINED_TYPE = 4
// JSON_ERROR = 5
// WRONG_PARAMETER = 6