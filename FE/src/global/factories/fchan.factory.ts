import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { FChanFactoryImplementation } from 'global/common/implementations/factories/fchan.factory.implementation';
import { FChanFactoryTypes } from './fchan.factory.type';

@Injectable({
    providedIn: 'root'
})
export class FChanFactory extends FactoryExtension<FChanFactoryImplementation, FChanFactoryTypes>  {

    public set<K extends keyof FChanFactoryTypes>(type: K, factory: FChanFactoryImplementation) {
        return super.set(type, factory);
    }

    public get<K extends keyof FChanFactoryTypes>(type: K): FChanFactoryImplementation {
        return super.get(type);
    }

    public remove<K extends keyof FChanFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
