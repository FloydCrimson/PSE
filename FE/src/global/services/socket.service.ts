import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { SocketFactory } from 'global/factories/socket.factory';
import { SocketFactoryTypes } from 'global/factories/socket.factory.type';
import { EndpointSocketImplementation } from 'global/common/implementations/endpoint-socket.implementation';
import { MessageSocketImplementation } from 'global/common/implementations/message-socket.implementation';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    constructor(
        private readonly socketFactory: SocketFactory
    ) { }

    public getMessage<K extends keyof SocketFactoryTypes, P>(type: K, endpoint: EndpointSocketImplementation<P>): MessageSocketImplementation<P> {
        const message: MessageSocketImplementation<P> = { operation: endpoint.operation, params: undefined };
        return message;
    }

    public send<K extends keyof SocketFactoryTypes, P>(type: K, endpoint: EndpointSocketImplementation<P>, params: P): boolean {
        return this.socketFactory.get(type).send(endpoint, params);
    }

    public receive<K extends keyof SocketFactoryTypes, P>(type: K, endpoint: EndpointSocketImplementation<P>): Observable<P> {
        return this.socketFactory.get(type).onMessage().pipe(
            filter((message) => message.operation === endpoint.operation),
            map((message) => {
                return message.params as P
            })
        );
    }

}
