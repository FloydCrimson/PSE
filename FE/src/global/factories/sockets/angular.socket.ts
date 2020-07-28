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
import { CoderProvider } from 'global/providers/coder.provider';

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

    public send<D>(endpoint: EndpointSocketImplementation<D>, data: D): boolean {
        if (this.socket && this.socket.readyState === this.socket.OPEN) {
            const message: MessageSocketImplementation<D> = { operation: endpoint.operation, data };
            this.socket.send(CoderProvider.encode(JSON.stringify(message)));
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

    public onMessage<D>(): Observable<MessageSocketImplementation<D>> {
        return this.subjectMessage.asObservable().pipe(
            map((message) => {
                return JSON.parse(CoderProvider.decode(message.data as any)) as MessageSocketImplementation<D>;
            })
        );
    }

    public onOpen(): Observable<any> {
        return this.subjectOpen.asObservable();
    }

}
