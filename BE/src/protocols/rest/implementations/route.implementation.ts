import * as Hapi from '@hapi/hapi';

import { StrategyOptionsType } from '../types/strategy.type';

export interface RouteImplementation<B = undefined, P = undefined, O = undefined> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | '*';
    path: string;
    options?: {
        cors?: Hapi.RouteOptionsCors;
        auth?: StrategyOptionsType;
    };
}
