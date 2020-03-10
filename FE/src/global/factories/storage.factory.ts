import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { StorageImplementation } from 'global/common/implementations/factories/storage.implementation';
import { StorageFactoryTypes } from './storage.factory.type';

@Injectable({
    providedIn: 'root'
})
export class StorageFactory extends FactoryExtension<StorageImplementation<StorageFactoryTypes[keyof StorageFactoryTypes]>, StorageFactoryTypes>  {

    public set<K extends keyof StorageFactoryTypes>(type: K, factory: StorageImplementation<StorageFactoryTypes[K]>) {
        return super.set(type, factory);
    }

    public get<K extends keyof StorageFactoryTypes>(type: K): StorageImplementation<StorageFactoryTypes[K]> {
        return <StorageImplementation<StorageFactoryTypes[K]>>super.get(type);
    }

    public remove<K extends keyof StorageFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
