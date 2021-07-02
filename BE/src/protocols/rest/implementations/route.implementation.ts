import * as Hapi from '@hapi/hapi';

export interface RouteImplementation<B = undefined, P = undefined, O = undefined> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | '*';
    path: string;
    options?: {
        cors?: Hapi.RouteOptions['cors'];
        auth?: Hapi.RouteOptions['auth'];
    };
}
