import { RouteType } from '../../../types/route.type';
import { EchoRouteImplementation } from './echo.implementation';

export const EchoRoute: RouteType<EchoRouteImplementation> = {
    // /echo/echo
    EchoOPTIONS: {
        method: 'OPTIONS',
        path: '/echo/echo',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    EchoGET: {
        method: 'GET',
        path: '/echo/echo',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    EchoPOST: {
        method: 'POST',
        path: '/echo/echo',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    // /echo/echo-auth
    EchoAuthOPTIONS: {
        method: 'OPTIONS',
        path: '/echo/echo-auth',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    EchoAuthGET: {
        method: 'GET',
        path: '/echo/echo-auth',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } }
    },
    EchoAuthPOST: {
        method: 'POST',
        path: '/echo/echo-auth',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } }
    }
};
