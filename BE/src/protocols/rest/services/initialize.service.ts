import 'reflect-metadata';

import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { ControllerService } from './controller.service';
import { SendProvider } from '../providers/send.provider';
import * as MI from '../middlewares.index';
import * as RI from '../routes.index';

export class InitializeService implements InitializeImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public initialize(port: number): Promise<boolean> {
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
                            const result = this.dispatcherService.get('ControllerService').get(route.handler.controller)[route.handler.action](request, response, next);
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
            const server = app.listen(port, (...args: any[]) => {
                console.log(`Express Rest server has started on port ${server.address().port}. Open http://localhost:${server.address().port}/echo to see results.`);
                resolve(true);
            });
        }).then((result) => {
            // DISPATCHER
            if (result) {
                this.dispatcherService.set('ControllerService', new ControllerService(this.dispatcherService));
            }
            return result;
        });
    }

}
