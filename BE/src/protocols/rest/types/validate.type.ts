import * as Hapi from '@hapi/hapi';

import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export type ValidateOptionsType = Hapi.RouteOptionsValidate['options'];
export type ValidateMethodType<R, M = any> = R extends RouteImplementation<infer B, infer P, infer O> ? (dispatcherService: DispatcherService) => (this: M, value: object | Buffer | string, options: ValidateOptionsType) => Promise<any> : unknown;
export type ValidateMethodFactoryType<P> = (params: P) => ValidateMethodType<RouteImplementation, any>;
export type ValidateObjectType<R, M = any> = { headers?: ValidateMethodType<R, M>; params?: ValidateMethodType<R, M>; payload?: ValidateMethodType<R, M>; query?: ValidateMethodType<R, M>; state?: ValidateMethodType<R, M>; output?: ValidateMethodType<R, M>; options?: ValidateOptionsType; };
export type ValidatePluginType<P, M = any> = { [KP in keyof P]?: P[KP] extends RouteImplementation ? ValidateObjectType<P[KP], M> : unknown; };
