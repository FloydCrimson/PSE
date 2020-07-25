import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { RestFactoryImplementation } from 'global/common/implementations/factories/rest.factory.implementation';
import { RestFactoryTypes } from './rest.factory.type';

@Injectable({
    providedIn: 'root'
})
export class RestFactory extends FactoryExtension<RestFactoryImplementation, RestFactoryTypes>  {

    public set<K extends keyof RestFactoryTypes>(type: K, factory: RestFactoryImplementation) {
        return super.set(type, factory);
    }

    public get<K extends keyof RestFactoryTypes>(type: K): RestFactoryImplementation {
        return super.get(type);
    }

    public remove<K extends keyof RestFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
