import { RouteImplementation } from '../implementations/route.implementation';
import * as MI from '../middlewares.index';

export interface EchoRouteImplementation {
    Echo: RouteImplementation<{ [key: string]: string }, { [key: string]: string }>;
}

export const EchoRoute: EchoRouteImplementation = {
    // /echo
    Echo: {
        endpoint: { route: '/echo' },
        middlewares: [MI.AuthMiddleware()],
        handler: { controller: 'EchoController', action: 'echo' }
    }
};
