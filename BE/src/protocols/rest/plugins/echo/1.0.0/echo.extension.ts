import { Request, ResponseToolkit } from '@hapi/hapi';

import { ExtensionPluginType } from '../../../types/extension.type';
import { EchoRouteImplementation } from './echo.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';
import { EchoMethodImplementation } from '../common/echo.implementation';

const EchoOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoOPTIONS'] = {
    onPreHandler: [
        {
            method: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
                this.Log(request, 'EchoOPTIONSExtension.onPreHandler', err || request.url); return h.continue;
            }
        }
    ]
};

const EchoGETExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoGET'] = {
    onPreHandler: [
        {
            method: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
                this.Log(request, 'EchoGETExtension.onPreHandler', err || request.url); return h.continue;
            }
        }
    ]
};

const EchoPOSTExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoPOST'] = {
    onPreHandler: [
        {
            method: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
                this.Log(request, 'EchoPOSTExtension.onPreHandler', err || request.url); return h.continue;
            }
        }
    ]
};

const EchoAuthOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthOPTIONS'] = {
    onPreHandler: [
        {
            method: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
                this.Log(request, 'EchoAuthOPTIONSExtension.onPreHandler', err || request.url); return h.continue;
            }
        }
    ]
};

const EchoAuthGETExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthGET'] = {
    onPreHandler: [
        {
            method: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
                this.Log(request, 'EchoAuthGETExtension.onPreHandler', err || request.url); return h.continue;
            }
        }
    ]
};

const EchoAuthPOSTExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPOST'] = {
    onPreHandler: [
        {
            method: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
                this.Log(request, 'EchoAuthPOSTExtension.onPreHandler', err || request.url); return h.continue;
            }
        }
    ]
};

export const EchoExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoOPTIONS: EchoOPTIONSExtension,
    EchoGET: EchoGETExtension,
    EchoPOST: EchoPOSTExtension,
    // /echo/echo-auth
    EchoAuthOPTIONS: EchoAuthOPTIONSExtension,
    EchoAuthGET: EchoAuthGETExtension,
    EchoAuthPOST: EchoAuthPOSTExtension
};
