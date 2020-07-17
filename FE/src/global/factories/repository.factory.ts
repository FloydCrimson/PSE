import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { RepositoryFactoryImplementation } from 'global/common/implementations/factories/repository.factory.implementation';
import { RepositoryFactoryTypes } from './repository.factory.type';

@Injectable({
    providedIn: 'root'
})
export class RepositoryFactory extends FactoryExtension<RepositoryFactoryImplementation, RepositoryFactoryTypes>  {

    public set<K extends keyof RepositoryFactoryTypes>(type: K, factory: RepositoryFactoryImplementation) {
        return super.set(type, factory);
    }

    public get<K extends keyof RepositoryFactoryTypes>(type: K): RepositoryFactoryImplementation {
        return super.get(type);
    }

    public remove<K extends keyof RepositoryFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
