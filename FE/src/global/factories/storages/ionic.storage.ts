import { Storage } from '@ionic/storage';

import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export class IonicStorage<T> implements StorageFactoryImplementation<T> {

    constructor(
        private readonly storage: Storage
    ) { }

    public ready(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.ready().then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.set(key as string, data).then((resolved) => {
                resolve();
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            this.storage.get(key as string).then((resolved) => {
                resolve(resolved as T[K]);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.remove(key as string).then((resolved) => {
                resolve();
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.clear().then((resolved) => {
                resolve();
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

}
