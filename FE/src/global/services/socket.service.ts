import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CoderProvider, NonceProvider } from 'pse-global-providers';
import * as Hawk from 'hawk';

import { DomainConfig } from '@domains/domain';

import { EndpointSocketImplementation } from 'global/common/implementations/endpoint-socket.implementation';
import { MessageSocketImplementation } from 'global/common/implementations/message-socket.implementation';
import { SocketFactory } from 'global/factories/socket.factory';
import { SocketFactoryTypes } from 'global/factories/socket.factory.type';
import { EphemeralStorageFactory } from 'global/factories/ephemeral-storages.factory';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    constructor(
        private readonly socketFactory: SocketFactory,
        private readonly eStorageFactory: EphemeralStorageFactory
    ) { }

    public getMessage<K extends keyof SocketFactoryTypes, P>(type: K, endpoint: EndpointSocketImplementation<P>): MessageSocketImplementation<P> {
        const message: MessageSocketImplementation<P> = { operation: endpoint.operation, params: undefined };
        return message;
    }

    public open<K extends keyof SocketFactoryTypes>(type: K): Observable<boolean> {
        const protocol = DomainConfig.protocols['socket'];
        const url = `${protocol.secure ? 'wss' : 'ws'}://${protocol.url}:${protocol.port}`;
        return this.socketFactory.get(type).open(url);
    }

    public close<K extends keyof SocketFactoryTypes>(type: K): Observable<boolean> {
        return this.socketFactory.get(type).close();
    }

    public send<K extends keyof SocketFactoryTypes, P>(type: K, endpoint: EndpointSocketImplementation<P>, params: P): Observable<boolean> {
        const auth = endpoint.auth ? this.eStorageFactory.get('In').get('auth') : undefined;
        const message: MessageSocketImplementation<P> = { operation: endpoint.operation, params };
        const protocol = DomainConfig.protocols['socket'];
        const url: string = `${protocol.secure ? 'https' : 'http'}://${protocol.url}:${protocol.port}${endpoint.operation}`;
        const credentials = auth ? { id: CoderProvider.encode(JSON.stringify({ [auth.type]: auth.value })), key: auth.key, algorithm: auth.algorithm } : undefined;
        if (endpoint.auth && credentials) {
            const timestamp: number = Math.floor(Date.now() / 1000);
            const nonce: string = NonceProvider.generate(credentials.key, timestamp);
            const options = { credentials, timestamp, nonce, payload: JSON.stringify(params), contentType: 'application/json' };
            const output = Hawk.client.header(url, 'GET', options);
            message.auth = output.header;
        }
        return this.socketFactory.get(type).send(message);
    }

    public receive<K extends keyof SocketFactoryTypes, P>(type: K, endpoint: EndpointSocketImplementation<P>): Observable<P> {
        return this.socketFactory.get(type).receive().pipe(
            filter((message: MessageSocketImplementation<P>) => message.operation === endpoint.operation),
            map((message) => message.params as P)
        );
    }

}
