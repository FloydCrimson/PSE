import { Injectable } from '@angular/core';

import { FactoryExtension } from 'global/common/extensions/factory.extension';
import { SocketFactoryImplementation } from 'global/common/implementations/factories/socket.factory.implementation';
import { SocketFactoryTypes } from './socket.factory.type';

@Injectable({
    providedIn: 'root'
})
export class SocketFactory extends FactoryExtension<SocketFactoryImplementation, SocketFactoryTypes>  {

    public set<K extends keyof SocketFactoryTypes>(type: K, factory: SocketFactoryImplementation) {
        return super.set(type, factory);
    }

    public get<K extends keyof SocketFactoryTypes>(type: K): SocketFactoryImplementation {
        return super.get(type);
    }

    public remove<K extends keyof SocketFactoryTypes>(type: K): boolean {
        return super.remove(type);
    }

    public clear(): boolean {
        return super.clear();
    }

}
