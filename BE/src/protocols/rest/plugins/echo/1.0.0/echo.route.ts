import { RouteType } from '../../../types/route.type';
import { EchoRouteImplementation } from './echo.implementation';
import { HawkVersionStrategy as HVS_1_0_0 } from '../../../strategies/hawk/1.0.0/hawk.strategy';

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
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Full }
    },
    EchoAuthFullPOST: {
        method: 'POST',
        path: '/echo/echo-auth-full',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Full }
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
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Partial }
    },
    EchoAuthPartialPOST: {
        method: 'POST',
        path: '/echo/echo-auth-partial',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Partial }
    }
};
