import { RouteImplementation } from '../implementations/route.implementation';
import { MethodType } from '../types/method.type';
import * as MI from '../middlewares.index';

export interface EchoRouteImplementation {
    EchoGET: RouteImplementation<undefined, { [key: string]: string }, { [key: string]: string }>;
}

export const EchoRoute: EchoRouteImplementation = {
    // /echo
    EchoGET: {
        endpoint: { method: MethodType.GET, route: '/echo' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'EchoController', action: 'echo' }
    }
};
