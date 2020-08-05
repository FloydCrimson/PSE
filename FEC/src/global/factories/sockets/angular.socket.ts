import { Observable, Subject, of, throwError, merge, from, timer } from 'rxjs';
import { map, take, exhaustMap, catchError } from 'rxjs/operators';
import * as hawk from '@hapi/hawk';

import { domain } from '@domains/domain';

import { SocketFactoryImplementation } from 'global/common/implementations/factories/socket.factory.implementation';
import { EndpointSocketImplementation } from 'global/common/implementations/endpoint-socket.implementation';
import { MessageSocketImplementation } from 'global/common/implementations/message-socket.implementation';
import { ErrorSocketImplementation } from 'global/common/implementations/error-socket.implementation';
import { StorageFactory } from 'global/factories/storage.factory';
import { NonceProvider } from 'global/providers/nonce.provider';
import { CoderProvider } from 'global/providers/coder.provider';
import { LoggingService } from 'global/services/logging.service';

export class AngularSocket implements SocketFactoryImplementation {

    private readonly TIMEOUT = 30000;

    private socket: WebSocket;
    private subjectClose: Subject<CloseEvent> = new Subject<CloseEvent>();
    private subjectError: Subject<Event> = new Subject<Event>();
    private subjectMessage: Subject<MessageEvent> = new Subject<MessageEvent>();
    private subjectOpen: Subject<Event> = new Subject<Event>();

    constructor(
        private readonly storageFactory: StorageFactory,
        private readonly loggingService: LoggingService
    ) { }

    public open(): Observable<boolean> {
        if (this.socket && this.socket.readyState === this.socket.OPEN) {
            return of(true);
        } else {
            const timeout$ = timer(this.TIMEOUT).pipe(exhaustMap(_ => throwError({ type: 'timeout' })));
            const error$ = this.subjectError.asObservable().pipe(exhaustMap((error) => throwError({ type: 'error', value: error })));
            const closing$ = (this.socket && this.socket.readyState === this.socket.CLOSING) ?
                merge(this.subjectClose.asObservable(), timeout$, error$).pipe(take(1), map(_ => true)) :
                of(true);
            return closing$.pipe(
                exhaustMap(_ => {
                    if (!this.socket || this.socket.readyState === this.socket.CLOSED) {
                        const protocol = domain.protocols['socket'];
                        const url: string = `${protocol.secure ? 'wss' : 'ws'}://${protocol.url}:${protocol.port}`;
                        this.socket = new WebSocket(url);
                        this.socket.addEventListener('close', (event) => this.subjectClose.next(event));
                        this.socket.addEventListener('error', (event) => this.subjectError.next(event));
                        this.socket.addEventListener('message', (event) => this.subjectMessage.next(event));
                        this.socket.addEventListener('open', (event) => this.subjectOpen.next(event));
                    }
                    const opening$ = (this.socket.readyState !== this.socket.OPEN) ?
                        merge(this.subjectOpen.asObservable(), timeout$, error$).pipe(take(1), map(_ => true)) :
                        of(true);
                    return opening$;
                }),
                catchError((error: { type: 'timeout' | 'error', value?: any }) => {
                    if (error.type === 'timeout') {
                        this.loggingService.LOG('WARN', { class: AngularSocket.name, function: this.open.name, text: 'Socket timeout.' }, this.socket);
                        if (this.socket.readyState === this.socket.CONNECTING) {
                            this.socket.close();
                        }
                    }
                    return of(false);
                })
            );
        }
    }

    public close(): Observable<boolean> {
        if (this.socket) {
            if (this.socket.readyState === this.socket.CLOSED) {
                return of(true);
            } else {
                const timeout$ = timer(this.TIMEOUT).pipe(exhaustMap(_ => throwError({ type: 'timeout' })));
                const error$ = this.subjectError.asObservable().pipe(exhaustMap((error) => throwError({ type: 'error', value: error })));
                const opening$ = this.socket.readyState === this.socket.CONNECTING ?
                    merge(this.subjectOpen.asObservable(), timeout$, error$).pipe(take(1), map(_ => true)) :
                    of(true);
                return opening$.pipe(
                    exhaustMap(_ => {
                        if (this.socket.readyState === this.socket.OPEN) {
                            this.socket.close();
                        }
                        const closing$ = (this.socket.readyState !== this.socket.CLOSED) ?
                            merge(this.subjectClose.asObservable(), timeout$, error$).pipe(take(1), map(_ => true)) :
                            of(true);
                        return closing$;
                    }),
                    catchError((error: { type: 'timeout' | 'error', value?: any }) => {
                        if (error.type === 'timeout') {
                            this.loggingService.LOG('WARN', { class: AngularSocket.name, function: this.open.name, text: 'Socket timeout.' }, this.socket);
                            if (this.socket.readyState === this.socket.CONNECTING) {
                                this.socket.close();
                            }
                        }
                        return of(false);
                    })
                );
            }
        } else {
            return of(true);
        }
    }

    public send<P>(endpoint: EndpointSocketImplementation<P>, params: P): Observable<boolean> {
        if (this.socket) {
            if (this.socket.readyState === this.socket.CLOSING || this.socket.readyState === this.socket.CLOSED) {
                return of(false);
            } else {
                const timeout$ = timer(this.TIMEOUT).pipe(exhaustMap(_ => throwError({ type: 'timeout' })));
                const error$ = this.subjectError.asObservable().pipe(exhaustMap((error) => throwError({ type: 'error', value: error })));
                const opening$ = this.socket.readyState === this.socket.CONNECTING ?
                    merge(this.subjectOpen.asObservable(), timeout$, error$).pipe(take(1), map(_ => true)) :
                    of(true);
                return opening$.pipe(
                    exhaustMap(_ => {
                        return from(endpoint.auth ? this.storageFactory.get('TempInData').get('auth') : of(undefined)).pipe(
                            map((auth) => {
                                const message: MessageSocketImplementation<P> = { operation: endpoint.operation, params };
                                const protocol = domain.protocols['socket'];
                                const url: string = `${protocol.secure ? 'https' : 'http'}://${protocol.url}:${protocol.port}${endpoint.operation}`;
                                const credentials = auth ? { id: CoderProvider.encode(JSON.stringify({ [auth.type]: auth.value })), key: auth.key, algorithm: auth.algorithm } : undefined;
                                if (endpoint.auth && credentials) {
                                    const timestamp: number = Math.floor(Date.now() / 1000);
                                    const nonce: string = NonceProvider.generate(credentials.key, timestamp);
                                    const options = { credentials, timestamp, nonce, payload: JSON.stringify(params), contentType: 'application/json' };
                                    const output = hawk.client.header(url, 'GET', options);
                                    message.auth = output.header;
                                }
                                this.socket.send(JSON.stringify(message));
                                return true;
                            })
                        );
                    }),
                    catchError((error: { type: 'timeout' | 'error', value?: any }) => {
                        if (error.type === 'timeout') {
                            this.loggingService.LOG('WARN', { class: AngularSocket.name, function: this.open.name, text: 'Socket timeout.' }, this.socket);
                            if (this.socket.readyState === this.socket.CONNECTING) {
                                this.socket.close();
                            }
                        }
                        return of(false);
                    })
                );
            }
        } else {
            return of(false);
        }
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
