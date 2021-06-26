import * as Hapi from '@hapi/hapi';

import { Masks } from '../providers/controller-method-wrapper.provider';

export interface RouteImplementation<B = undefined, P = undefined, O = undefined> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | '*';
    path: string;
    options?: {
        cors?: Hapi.RouteOptionsCors;
        auth?: Hapi.RouteOptionsAccess;
    };
    masks?: {
        maskB?: Masks;
        maskP?: Masks;
        maskO?: Masks;
    }
}
