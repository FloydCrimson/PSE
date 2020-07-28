import { Observable } from 'rxjs';

import { EndpointSocketImplementation } from '../endpoint-socket.implementation';
import { MessageSocketImplementation } from '../message-socket.implementation';
import { ErrorSocketImplementation } from '../error-socket.implementation';

export interface SocketFactoryImplementation {
    open(): boolean;
    send<D>(endpoint: EndpointSocketImplementation<D>, data: D): boolean;
    onClose(): Observable<any>;
    onError(): Observable<ErrorSocketImplementation>;
    onMessage<D>(): Observable<MessageSocketImplementation<D>>;
    onOpen(): Observable<any>;
}
