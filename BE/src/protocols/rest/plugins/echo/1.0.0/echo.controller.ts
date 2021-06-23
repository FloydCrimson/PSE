import { Request, ResponseToolkit } from '@hapi/hapi';

import { ControllerPluginType } from '../../../types/controller.type';
import { EchoRouteImplementation } from './echo.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';
import { EchoMethodImplementation } from '../common/echo.implementation';

export const EchoController: ControllerPluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoGET: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello GET World!' };
        return h.response(output).code(200);
    },
    EchoPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello POST World!' };
        return h.response(output).code(200);
    },
    // /echo/echo-auth
    EchoAuthGET: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello AuthGET World!' };
        return h.response(output).code(200);
    },
    EchoAuthPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello AuthPOST World!' };
        return h.response(output).code(200);
    }
};
