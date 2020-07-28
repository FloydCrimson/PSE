import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
// import * as hawk from '@hapi/hawk';

import { domain } from '@domains/domain';

import { SocketFactoryImplementation } from 'global/common/implementations/factories/socket.factory.implementation';
import { EndpointSocketImplementation } from 'global/common/implementations/endpoint-socket.implementation';
import { MessageSocketImplementation } from 'global/common/implementations/message-socket.implementation';
import { ErrorSocketImplementation } from 'global/common/implementations/error-socket.implementation';
// import { StorageFactory } from 'global/factories/storage.factory';
// import { NonceProvider } from 'global/providers/nonce.provider';

export class AngularSocket implements SocketFactoryImplementation {

    private socket: WebSocket;
    private subjectClose: Subject<CloseEvent> = new Subject<CloseEvent>();
    private subjectError: Subject<Event> = new Subject<Event>();
    private subjectMessage: Subject<MessageEvent> = new Subject<MessageEvent>();
    private subjectOpen: Subject<Event> = new Subject<Event>();

    // constructor(
    //     private readonly storageFactory: StorageFactory
    // ) { }

    public open(): boolean {
        if (!this.socket || this.socket.readyState === this.socket.CLOSED) {
            const url: string = `ws://${domain.url}:${domain.port}`;
            this.socket = new WebSocket(url);
            this.socket.addEventListener('close', (event) => this.subjectClose.next(event));
            this.socket.addEventListener('error', (event) => this.subjectError.next(event));
            this.socket.addEventListener('message', (event) => this.subjectMessage.next(event));
            this.socket.addEventListener('open', (event) => this.subjectOpen.next(event));
            return true;
        }
        return false;
    }

    public send<P>(endpoint: EndpointSocketImplementation<P>, params: P): boolean {
        if (this.socket && this.socket.readyState === this.socket.OPEN) {
            const message: MessageSocketImplementation<P> = { operation: endpoint.operation, params };
            this.socket.send(JSON.stringify(message));
            return true;
        }
        return false;
    }

    public onClose(): Observable<any> {
        return this.subjectClose.asObservable();
    }

    public onError(): Observable<ErrorSocketImplementation> {
        return this.subjectError.asObservable().pipe(
            map((error) => {
                return { error } as ErrorSocketImplementation;
            })
        );
    }

    public onMessage<P>(): Observable<MessageSocketImplementation<P>> {
        return this.subjectMessage.asObservable().pipe(
            map((message) => {
                return JSON.parse(message.data as any) as MessageSocketImplementation<P>;
            })
        );
    }

    public onOpen(): Observable<any> {
        return this.subjectOpen.asObservable();
    }

}
