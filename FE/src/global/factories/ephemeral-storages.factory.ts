import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { EphemeralStorageFactoryImplementation } from 'global/common/implementations/factories/ephemeral-storage.factory.implementation';
import { EphemeralStorageFactoryTypes } from './ephemeral-storages.factory.type';

@Injectable({
    providedIn: 'root'
})
export class EphemeralStorageFactory extends FactoryExtension<EphemeralStorageFactoryImplementation<any>, EphemeralStorageFactoryTypes>  {

    public set<K extends keyof EphemeralStorageFactoryTypes>(type: K, factory: EphemeralStorageFactoryImplementation<EphemeralStorageFactoryTypes[K]>) {
        return super.set(type, factory);
    }

    public get<K extends keyof EphemeralStorageFactoryTypes>(type: K): EphemeralStorageFactoryImplementation<EphemeralStorageFactoryTypes[K]> {
        return super.get(type);
    }

    public remove<K extends keyof EphemeralStorageFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
