import 'reflect-metadata';

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import { InitializeImplementation } from '../../common/implementations/initialize.implementation';

export class InitializeService implements InitializeImplementation {

    constructor() { }

    public initialize(port: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const app = express();

            const server = http.createServer(app);
            const wss = new WebSocket.Server({ server });
            wss.on('connection', (ws: WebSocket) => {
                ws.on('message', (message: string) => {
                    console.log('received: %s', message);
                    ws.send(`Hello, you sent -> ${message}`);
                });
                ws.send('Hi there, I am a WebSocket server');
            });

            server.listen(port, (...args: any[]) => {
                console.log(`Express WebSocket server has started on port ${server.address().port}.`);

                resolve(true);
            });

        });
    }

}
