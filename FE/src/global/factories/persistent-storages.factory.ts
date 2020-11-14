import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { PersistentStorageFactoryImplementation } from 'global/common/implementations/factories/persistent-storage.factory.implementation';
import { PersistentStorageFactoryTypes } from './persistent-storages.factory.type';

@Injectable({
    providedIn: 'root'
})
export class PersistentStorageFactory extends FactoryExtension<PersistentStorageFactoryImplementation<any>, PersistentStorageFactoryTypes>  {

    public set<K extends keyof PersistentStorageFactoryTypes>(type: K, factory: PersistentStorageFactoryImplementation<PersistentStorageFactoryTypes[K]>) {
        return super.set(type, factory);
    }

    public get<K extends keyof PersistentStorageFactoryTypes>(type: K): PersistentStorageFactoryImplementation<PersistentStorageFactoryTypes[K]> {
        return super.get(type);
    }

    public remove<K extends keyof PersistentStorageFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
