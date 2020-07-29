import 'reflect-metadata';

import * as express from 'express';
import * as WebSocket from 'ws';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { ServerProvider } from '../../../global/providers/server.provider';
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
    ) { }

    public initialize(configurations: ProtocolConfigurationsType[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // SERVER
            const app = express();
            this.middlewares = [];
            this.middlewares.push(MI.ParamsMiddleware()(this.dispatcherService));
            this.map = new Map<string, { route: RouteImplementation<any, any>; middlewares: ((request: RequestImplementation, response: ResponseImplementation, next: express.NextFunction) => Promise<any>)[]; }>();
            for (const group in RI) {
                for (const item in RI[group]) {
                    const route: RouteImplementation<any, any> = RI[group][item];
                    if (!this.map.has(route.endpoint.route)) {
                        this.map.set(route.endpoint.route, { route, middlewares: (route.middlewares || []).map((middleware) => middleware(this.dispatcherService)) });
                    } else {
                        throw 'Duplicated route found.';
                    }
                }
            }
            const servers = ServerProvider.getServers(app, configurations);
            servers.forEach((server) => {
                const socketServer = new WebSocket.Server({ server: server.instance });
                socketServer.on('connection', (socket: WebSocket) => {
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
                                    this.dispatcherService.get('ControllerSocketService').get(value.route.handler.controller)[value.route.handler.action](request, response, next);
                                }
                            };
                            next();
                        }
                    });
                });
            });
            Promise.all(servers.map((server) => {
                return new Promise<boolean>((resolve, reject) => {
                    server.instance.listen(server.port, (...args: any[]) => {
                        console.log(`Express Socket server has started on port ${server.instance.address().port}.`);
                        resolve(true);
                    });
                });
            })).then(result => {
                resolve(!result.some(c => !c));
            });
        }).then((result) => {
            // DISPATCHER
            if (result) {
                this.dispatcherService.set('ControllerSocketService', new ControllerService(this.dispatcherService));
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
