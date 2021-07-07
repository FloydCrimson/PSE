import * as Hapi from '@hapi/hapi';

import { ControllerPluginType } from '../../../types/controller.type';
import { EchoRouteImplementation } from './echo.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';
import { EchoMethodImplementation } from '../common/echo.implementation';

export const EchoController: ControllerPluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoGET: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello EchoGET World!' };
        return h.response(output).code(200);
    },
    EchoPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello EchoPOST World!' };
        return h.response(output).code(200);
    },
    // /echo/echo-auth-full
    EchoAuthFullGET: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello EchoAuthFullGET World!' };
        return h.response(output).code(200);
    },
    EchoAuthFullPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello EchoAuthFullPOST World!' };
        return h.response(output).code(200);
    },
    // /echo/echo-auth-full-crypted
    EchoAuthFullCryptedGET: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello EchoAuthFullCryptedGET World!' };
        return h.response(output).code(200);
    },
    EchoAuthFullCryptedPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello EchoAuthFullCryptedPOST World!' };
        return h.response(output).code(200);
    },
    // /echo/echo-auth-partial
    EchoAuthPartialGET: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello EchoAuthPartialGET World!' };
        return h.response(output).code(200);
    },
    EchoAuthPartialPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello EchoAuthPartialPOST World!' };
        return h.response(output).code(200);
    },
    // /echo/echo-auth-partial-crypted
    EchoAuthPartialCryptedGET: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.query).length > 0 ? request.query : { echo: 'Hello EchoAuthPartialCryptedGET World!' };
        return h.response(output).code(200);
    },
    EchoAuthPartialCryptedPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const output = Object.keys(request.payload).length > 0 ? request.payload : { echo: 'Hello EchoAuthPartialCryptedPOST World!' };
        return h.response(output).code(200);
    }
};
