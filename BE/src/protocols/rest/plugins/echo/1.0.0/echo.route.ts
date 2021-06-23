import { RouteType } from '../../../types/route.type';
import { EchoRouteImplementation } from './echo.implementation';

export const EchoRoute: RouteType<EchoRouteImplementation> = {
    // /echo/echo
    EchoOPTIONS: {
        method: 'OPTIONS',
        path: '/echo/echo'
    },
    EchoGET: {
        method: 'GET',
        path: '/echo/echo'
    },
    EchoPOST: {
        method: 'POST',
        path: '/echo/echo'
    },
    // /echo/echo-auth
    EchoAuthOPTIONS: {
        method: 'OPTIONS',
        path: '/echo/echo-auth'
    },
    EchoAuthGET: {
        method: 'GET',
        path: '/echo/echo-auth'
    },
    EchoAuthPOST: {
        method: 'POST',
        path: '/echo/echo-auth'
    }
};
