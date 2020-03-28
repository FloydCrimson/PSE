import 'reflect-metadata';

import { getConnectionOptions, createConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import { RouteImplementation } from './common/implementations/route.implementation';
import { DispatcherService } from './services/dispatcher.service';
import { SendProvider } from './providers/send.provider';
import * as MI from './middlewares.index';
import * as RI from './routes.index';

getConnectionOptions().then((connectionOptions) => createConnection(connectionOptions)).then((connection) => {
    // console.log(resolved);

    const dispatcherService: DispatcherService = new DispatcherService();

    const app = express();
    app.use(express.json()); // Content-Type: application/json
    // app.use(express.urlencoded({ extended: true })); // Content-Type: application/x-www-form-urlencoded
    // app.use(express.text()); // Content-Type: text/plain
    app.use(MI.LogMiddleware()(dispatcherService));
    app.use(MI.ParamsMiddleware()(dispatcherService));
    for (const group in RI) {
        for (const item in RI[group]) {
            const route: RouteImplementation<any, any, any> = RI[group][item];
            app[route.endpoint.method](route.endpoint.route, (route.middlewares || []).map((middleware) => middleware(dispatcherService)), (request: Request, response: Response, next: NextFunction) => {
                if (route.handler) {
                    const result = dispatcherService.get('ControllerService').get(route.handler.controller)[route.handler.action](request, response, next);
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
    const server = app.listen(3000);

    console.log(`Express server has started on port ${server.address().port}. Open http://localhost:${server.address().port}/echo to see results`);

}, (rejected) => console.log(rejected)).catch((caught) => console.log(caught));
