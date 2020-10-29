import { Observable, Subject, of, throwError, merge, timer } from 'rxjs';
import { map, take, exhaustMap, catchError } from 'rxjs/operators';

import { SocketFactoryImplementation } from 'global/common/implementations/factories/socket.factory.implementation';
import { LoggingService } from 'global/services/logging.service';

export class AngularSocket implements SocketFactoryImplementation {

    private readonly TIMEOUT = 30000;

    private socket: WebSocket;
    private subjectClose: Subject<CloseEvent> = new Subject<CloseEvent>();
    private subjectError: Subject<Event> = new Subject<Event>();
    private subjectMessage: Subject<MessageEvent> = new Subject<MessageEvent>();
    private subjectOpen: Subject<Event> = new Subject<Event>();

    constructor(
        private readonly loggingService: LoggingService
    ) { }

    public open(url: string): Observable<boolean> {
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
                catchError((error: { type: 'timeout' | 'error'; value?: any; }) => {
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
                    catchError((error: { type: 'timeout' | 'error'; value?: any; }) => {
                        if (error.type === 'timeout') {
                            this.loggingService.LOG('WARN', { class: AngularSocket.name, function: this.close.name, text: 'Socket timeout.' }, this.socket);
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

    public send(message: Object): Observable<boolean> {
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
                    map(_ => {
                        this.socket.send(JSON.stringify(message));
                        return true;
                    }),
                    catchError((error: { type: 'timeout' | 'error'; value?: any; }) => {
                        if (error.type === 'timeout') {
                            this.loggingService.LOG('WARN', { class: AngularSocket.name, function: this.send.name, text: 'Socket timeout.' }, this.socket);
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

    public receive(): Observable<Object> {
        return this.subjectMessage.asObservable().pipe(
            map((message) => JSON.parse(message.data))
        );
    }

}
