import 'reflect-metadata';

import { getConnectionOptions, createConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import { InitializeImplementation } from '../../common/implementations/initialize.implementation';
import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from './dispatcher.service';
import { SendProvider } from '../../../global/common/providers/send.provider';
// import { RoleType } from './common/types/role.type';
// import * as EI from './entities.index';
import * as MI from '../middlewares.index';
import * as RI from '../routes.index';

export class InitializeService implements InitializeImplementation {

    constructor() { }

    public initialize(port: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            getConnectionOptions().then((connectionOptions) => createConnection(connectionOptions)).then((connection) => {

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
                const server = app.listen(port, (...args: any[]) => {
                    console.log(`Express Rest server has started on port ${server.address().port}. Open http://localhost:${server.address().port}/echo to see results.`);

                    // const authEntity = new EI.AuthEntity();
                    // authEntity.id = 'dh37fgj492je';
                    // authEntity.email = 'pippo@ciaone.com';
                    // authEntity.nickname = 'Pippo';
                    // authEntity.key = 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn';
                    // authEntity.algorithm = 'sha256';
                    // authEntity.role = RoleType.USER;
                    // authEntity.status = 'auth';
                    // const authEntityRepository = connection.getRepository(EI.AuthEntity);
                    // authEntityRepository.save(authEntity);

                    resolve(true);
                });

            }, (rejected) => {
                console.log('Express Rest server has not started: ', rejected);
                reject(rejected);
            }).catch((caught) => {
                console.log('Express Rest server has not started: ', caught);
                reject(caught);
            });
        });
    }

}
