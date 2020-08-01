import { RouteImplementation } from '../implementations/route.implementation';
import * as MI from '../middlewares.index';

export interface EchoRouteImplementation {
    EchoSEND: RouteImplementation<any>;
    EchoRECEIVE: RouteImplementation<any>;
    EchoAuthSEND: RouteImplementation<any>;
    EchoAuthRECEIVE: RouteImplementation<any>;
}

export const EchoRoute: EchoRouteImplementation = {
    // /echo/echo
    EchoSEND: {
        operation: '/echo/echo'
    },
    EchoRECEIVE: {
        operation: '/echo/echo',
        handler: { controller: 'EchoController', action: 'EchoRECEIVE' }
    },
    // /echo/echo-auth
    EchoAuthSEND: {
        operation: '/echo/echo-auth'
    },
    EchoAuthRECEIVE: {
        operation: '/echo/echo-auth',
        middlewares: [MI.AuthMiddleware()],
        handler: { controller: 'EchoController', action: 'EchoAuthRECEIVE' }
    }
};
