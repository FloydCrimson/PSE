import 'reflect-metadata';

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from '../implementations/request.implementation';
import { ResponseImplementation } from '../implementations/response.implementation';
import { ControllerService } from './controller.service';
import * as MI from '../middlewares.index';
import * as RI from '../routes.index';

export class InitializeService implements InitializeImplementation {

    private middlewares: ((request: RequestImplementation, response: ResponseImplementation, next: express.NextFunction) => Promise<any>)[];
    private map: Map<string, { route: RouteImplementation<any, any>; middlewares: ((request: RequestImplementation, response: ResponseImplementation, next: express.NextFunction) => Promise<any>)[]; }>;

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        this.middlewares = [];
        this.map = new Map<string, { route: RouteImplementation<any, any>; middlewares: ((request: RequestImplementation, response: ResponseImplementation, next: express.NextFunction) => Promise<any>)[]; }>();
    }

    public initialize(port: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // SERVER
            const app = express();
            const server = http.createServer(app);
            server.listen(port, (...args: any[]) => {
                console.log(`Express WebSocket server has started on port ${server.address().port}.`);
                this.middlewares.push(MI.ParamsMiddleware()(this.dispatcherService));
                for (const group in RI) {
                    for (const item in RI[group]) {
                        const route: RouteImplementation<any, any> = RI[group][item];
                        if (!this.map.has(route.endpoint.route)) {
                            this.map.set(route.endpoint.route, { route, middlewares: (route.middlewares || []).map((middleware) => middleware(this.dispatcherService)) });
                        } else {
                            throw 'duplicated route found.';
                        }
                    }
                }
                resolve(true);
            });
            const socketServer = new WebSocket.Server({ server });
            socketServer.on('connection', (socket: WebSocket, request: http.IncomingMessage) => {
                socket.on('message', (data: WebSocket.Data) => {
                    let request: RequestImplementation = { socket, ...this.getParsedData(data) };
                    let response: ResponseImplementation = { socket, output: undefined };
                    if (this.map.has(request.route)) {
                        const value = this.map.get(request.route);
                        const middlewares = [...this.middlewares, ...value.middlewares];
                        let i = 0;
                        const next = () => {
                            if (i < middlewares.length) {
                                middlewares[i++](request, response, next);
                            } else if (value.route.handler) {
                                this.dispatcherService.get('ControllerWebSocketService').get(value.route.handler.controller)[value.route.handler.action](request, response, next);
                            }
                        };
                        next();
                    }
                });
            });
        }).then((result) => {
            // DISPATCHER
            if (result) {
                this.dispatcherService.set('ControllerWebSocketService', new ControllerService(this.dispatcherService));
            }
            return result;
        });
    }

    //

    private getParsedData(data: WebSocket.Data): { route: string; auth?: string; input: any; } {
        if (typeof data === 'string') { // string
            return JSON.parse(data);
        } else if (data.constructor === Buffer.constructor) { // Buffer
            throw '[InitializeService.getResponseFromData] conversion from "Buffer" not implemented.';
        } else if (data.constructor === ArrayBuffer.constructor) { // ArrayBuffer
            throw '[InitializeService.getResponseFromData] conversion from "ArrayBuffer" not implemented.';
        } else { // Buffer[]
            throw '[InitializeService.getResponseFromData] conversion from "Buffer[]" not implemented.';
        }
    }

}
