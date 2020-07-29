import * as WebSocket from 'ws';

export interface RequestImplementation {
    socket: WebSocket;
    route: string;
    auth?: string;
    input: any;
}
