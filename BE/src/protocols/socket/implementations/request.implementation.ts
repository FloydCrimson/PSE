import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

import { MessageImplementation } from './message.implementation';

export interface RequestImplementation {
    socket: WebSocket;
    request: IncomingMessage;
    message: MessageImplementation;
    locals: any;
}
