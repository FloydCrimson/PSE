import { RouteImplementation } from '../implementations/route.implementation';
import * as MI from '../middlewares.index';

export interface EchoRouteImplementation {
    EchoSEND: RouteImplementation<any>;
    EchoRECEIVE: RouteImplementation<any>;
}

export const EchoRoute: EchoRouteImplementation = {
    // /echo/echo
    EchoSEND: {
        operation: '/echo/echo'
    },
    EchoRECEIVE: {
        operation: '/echo/echo',
        handler: { controller: 'EchoController', action: 'echo' }
    }
};
