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
    // /echo/echo-auth-full
    EchoAuthFullOPTIONS: {
        method: 'OPTIONS',
        path: '/echo/echo-auth-full',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    EchoAuthFullGET: {
        method: 'GET',
        path: '/echo/echo-auth-full',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } }
    },
    EchoAuthFullPOST: {
        method: 'POST',
        path: '/echo/echo-auth-full',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } }
    },
    // /echo/echo-auth-partial
    EchoAuthPartialOPTIONS: {
        method: 'OPTIONS',
        path: '/echo/echo-auth-partial',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    EchoAuthPartialGET: {
        method: 'GET',
        path: '/echo/echo-auth-partial',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Partial', mode: 'required', payload: 'required' } }
    },
    EchoAuthPartialPOST: {
        method: 'POST',
        path: '/echo/echo-auth-partial',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Partial', mode: 'required', payload: 'required' } }
    }
};
