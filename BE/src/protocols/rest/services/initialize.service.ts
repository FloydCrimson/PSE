import 'reflect-metadata';

import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { ServerProvider } from '../../../global/providers/server.provider';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationImplementationType } from '../../common/implementations/communication.implementation.type';
import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from './dispatcher.service';
import { ControllerService } from './controller.service';
import { CommunicationService } from './communication.service';
import { SendProvider } from '../providers/send.provider';
import * as MI from '../middlewares.index';
import * as RI from '../routes.index';

export class InitializeService implements InitializeImplementation {

    private readonly dispatcherService: DispatcherService = new DispatcherService();

    constructor() { }

    public initialize(configurations: ProtocolConfigurationsType[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // SERVER
            const app = express();
            app.use(express.json()); // Content-Type: application/json
            // app.use(express.urlencoded({ extended: true })); // Content-Type: application/x-www-form-urlencoded
            // app.use(express.text()); // Content-Type: text/plain
            app.use(MI.LogMiddleware()(this.dispatcherService));
            app.use(MI.ParamsMiddleware()(this.dispatcherService));
            for (const group in RI) {
                for (const item in RI[group]) {
                    const route: RouteImplementation<any, any, any> = RI[group][item];
                    app[route.endpoint.method](route.endpoint.route, (route.middlewares || []).map((middleware) => middleware(this.dispatcherService)), (request: Request, response: Response, next: NextFunction) => {
                        if (route.handler) {
                            const result: Promise<any> = this.dispatcherService.get('ControllerService').get(route.handler.controller)[route.handler.action](request, response, next);
                            result.then(
                                (resolved) => SendProvider.sendResponse(request, response, 200, resolved),
                                (rejected) => SendProvider.sendError(request, response, 500, rejected)
                            ).catch((caught) => SendProvider.sendError(request, response, 500, caught));
                        } else {
                            SendProvider.sendResponse(request, response);
                        }
                    });
                }
            }
            const servers = ServerProvider.getServers(app, configurations);
            Promise.all(servers.map((server) => {
                return new Promise<boolean>((resolve, reject) => {
                    server.instance.listen(server.port, (...args: any[]) => {
                        console.log(`Express Rest server has started on port ${server.instance.address().port}. Open localhost:${server.instance.address().port}/echo/echo to see results.`);
                        resolve(true);
                    });
                });
            })).then(result => {
                resolve(!result.some(c => !c));
            });
        }).then((result) => {
            // DISPATCHER
            if (result) {
                const controllerService = new ControllerService(this.dispatcherService);
                const communicationClientService = new CommunicationClientService<CommunicationImplementationType, 'rest'>(new CommunicationService(), 'rest');
                this.dispatcherService.set('ControllerService', controllerService);
                this.dispatcherService.set('CommunicationClientService', communicationClientService);
                communicationClientService.receive();
            }
            return result;
        });
    }

}
