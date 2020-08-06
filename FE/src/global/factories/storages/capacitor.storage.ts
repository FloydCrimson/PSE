import { StoragePlugin } from '@capacitor/core';

import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export class CapacitorStorage<T> implements StorageFactoryImplementation<T> {

    constructor(
        private readonly storagePlugin: StoragePlugin
    ) { }

    public ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.storagePlugin.set({ key: key as string, value: JSON.stringify(data) }).then((resolved) => {
                    resolve();
                }, (rejected) => {
                    reject(rejected);
                }).catch((caught) => {
                    reject(caught);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            this.storagePlugin.get({ key: key as string }).then((resolved) => {
                try {
                    resolve(JSON.parse(resolved.value) as T[K]);
                } catch (error) {
                    reject(error);
                }
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storagePlugin.remove({ key: key as string }).then((resolved) => {
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
            this.storagePlugin.clear().then((resolved) => {
                resolve();
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

}
