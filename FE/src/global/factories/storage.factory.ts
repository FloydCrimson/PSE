import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { StorageFactoryTypes } from './storage.factory.type';

@Injectable({
    providedIn: 'root'
})
export class StorageFactory extends FactoryExtension<StorageFactoryTypes[keyof StorageFactoryTypes], StorageFactoryTypes>  {

    public set<K extends keyof StorageFactoryTypes>(type: K, factory: StorageFactoryTypes[K]) {
        return super.set(type, factory);
    }

    public get<K extends keyof StorageFactoryTypes>(type: K): StorageFactoryTypes[K] {
        return <StorageFactoryTypes[K]>super.get(type);
    }

    public remove<K extends keyof StorageFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
