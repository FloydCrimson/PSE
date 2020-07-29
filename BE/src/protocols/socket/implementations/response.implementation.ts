import * as WebSocket from 'ws';

export interface ResponseImplementation {
    socket: WebSocket;
    output: any;
}
