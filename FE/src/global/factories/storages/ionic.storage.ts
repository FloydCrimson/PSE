import { Storage } from '@ionic/storage';

import { StorageImplementation } from 'global/common/implementations/factories/storage.implementation';

export class IonicStorage<T> implements StorageImplementation<T> {

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

    public set<K extends keyof T>(key: K, data: T[K]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.set(<string>key, data).then((resolved) => {
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
            this.storage.get(<string>key).then((resolved) => {
                resolve(<T[K]>resolved);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.remove(<string>key).then((resolved) => {
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
            this.storage.clear().then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

}
