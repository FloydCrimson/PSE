import 'reflect-metadata';

import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { ServerProvider } from '../../../global/providers/server.provider';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { RouteImplementation } from '../implementations/route.implementation';
import { RequestImplementation } from '../implementations/request.implementation';
import { DispatcherService } from './dispatcher.service';
import { ControllerService } from './controller.service';
import { CommunicationService } from './communication.service';

import * as MI from '../middlewares.index';
import * as RI from '../routes.index';

export class InitializeService implements InitializeImplementation {

    private readonly dispatcherService = new DispatcherService();

    private readonly middlewares = new Array<(request: RequestImplementation, next: express.NextFunction) => Promise<any>>();
    private readonly map = new Map<string, { route: RouteImplementation<any>; middlewares: ((request: RequestImplementation, next: express.NextFunction) => Promise<any>)[]; }>();

    constructor() {
        this.dispatcherService.set('ControllerService', new ControllerService(this.dispatcherService));
    }

    public async initialize(configurations: ProtocolConfigurationsType[]): Promise<boolean> {
        const app = express();
        this.middlewares.push(MI.ParamsMiddleware()(this.dispatcherService));
        for (const group in RI) {
            for (const item in RI[group]) {
                if (/RECEIVE$/.test(item)) {
                    const route: RouteImplementation<any> = RI[group][item];
                    if (!this.map.has(route.operation)) {
                        this.map.set(route.operation, { route, middlewares: (route.middlewares || []).map((middleware) => middleware(this.dispatcherService)) });
                    } else {
                        throw 'Duplicated operation found.';
                    }
                }
            }
        }
        const servers = await Promise.all(configurations.map(async (configuration) => {
            const server = ServerProvider.getServer(app, configuration);
            const sockets = new WebSocket.Server({ server: server.instance });
            // sockets.on('close', (socket: WebSocket, message: http.IncomingMessage) => { console.info('Socket server close', socket, message); });
            sockets.on('connection', (socket: WebSocket, message: http.IncomingMessage) => {
                // console.info('Socket server connection', socket, message);
                // socket.on('close', (code: number, reason: string) => { console.info('Socket connection close', code, reason); });
                // socket.on('error', (error: Error) => { console.error('Socket connection error', error); });
                socket.on('message', (data: WebSocket.Data) => {
                    let request: RequestImplementation = {
                        socket: socket,
                        request: message,
                        message: data as any,
                        locals: {}
                    };
                    let value: { route: RouteImplementation<any>; middlewares: ((request: RequestImplementation, next: express.NextFunction) => Promise<any>)[]; };
                    let i1 = 0, i2 = 0;
                    const next = () => {
                        if (i1 < this.middlewares.length) {
                            this.middlewares[i1++](request, next);
                        } else if (!value) {
                            value = this.map.get(request.message.operation);
                            if (value) {
                                next();
                            } else {
                                console.warn('Unmanageable request received:   ', request);
                            }
                        } else if (i2 < value.middlewares.length) {
                            value.middlewares[i2++](request, next);
                        } else if (value.route.handler) {
                            this.dispatcherService.get('ControllerService').get(value.route.handler.controller)[value.route.handler.action](request, next);
                        }
                    };
                    next();
                });
                // socket.on('open', (code: number, reason: string) => { console.info('Socket connection open', code, reason); });
                // socket.on('ping', (code: number, reason: string) => { console.info('Socket connection ping', code, reason); });
                // socket.on('pong', (code: number, reason: string) => { console.info('Socket connection pong', code, reason); });
                // socket.on('unexpected-response', (code: number, reason: string) => { console.info('Socket connection unexpected-response', code, reason); });
                // socket.on('upgrade', (code: number, reason: string) => { console.info('Socket connection upgrade', code, reason); });
            });
            // sockets.on('error', (error: Error) => { console.error('Socket server error', error); });
            // sockets.on('headers', (headers: string[], message: http.IncomingMessage) => { console.info('Socket server headers', headers, message); });
            // sockets.on('listening', (socket: WebSocket, message: http.IncomingMessage) => { console.info('Socket server listening', socket, message); });
            return server;
        }));
        const result = await Promise.all(servers.map((server) => {
            return new Promise<boolean>((resolve) => {
                try {
                    server.instance.listen(server.port, (...args: any[]) => {
                        console.log(`Express Socket server has started on port ${server.port}.`);
                        resolve(true);
                    });
                } catch (error) {
                    console.error(`Express Socket server has not started on port ${server.port}.`, error);
                    resolve(false);
                }
            });
        })).then((results) => !results.some(c => !c));
        if (result) {
            this.dispatcherService.set('CommunicationClientService', new CommunicationClientService(new CommunicationService(this.dispatcherService), 'socket'));
            this.dispatcherService.get('CommunicationClientService').receive();
        }
        return result;
    }

}
