import { RouteImplementation } from '../implementations/route.implementation';
import { MethodType } from '../types/method.type';
import * as MI from '../middlewares.index';

export interface EchoRouteImplementation {
    EchoOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    EchoGET: RouteImplementation<undefined, any, any>;
    EchoPOST: RouteImplementation<any, undefined, any>;
    EchoAuthOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    EchoAuthGET: RouteImplementation<undefined, any, any>;
    EchoAuthPOST: RouteImplementation<any, undefined, any>;
}

export const EchoRoute: EchoRouteImplementation = {
    // /echo/echo
    EchoOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/echo/echo' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.GET, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    EchoGET: {
        endpoint: { method: MethodType.GET, route: '/echo/echo' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'EchoController', action: 'EchoGET' }
    },
    EchoPOST: {
        endpoint: { method: MethodType.POST, route: '/echo/echo' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'EchoController', action: 'EchoPOST' }
    },
    // /echo/echo-auth
    EchoAuthOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/echo/echo-auth' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.GET, MethodType.POST], allowedHeaders: ['Authorization', 'Content-Type'] })]
    },
    EchoAuthGET: {
        endpoint: { method: MethodType.GET, route: '/echo/echo-auth' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'EchoController', action: 'EchoAuthGET' }
    },
    EchoAuthPOST: {
        endpoint: { method: MethodType.POST, route: '/echo/echo-auth' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'EchoController', action: 'EchoAuthPOST' }
    }
};
