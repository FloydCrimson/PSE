import * as Hapi from '@hapi/hapi';

import { MethodPluginType } from './method.type';
import { SchemeStrategyType } from './scheme.type';

export type StrategyOptionsType<O = any> = { auth: Hapi.RouteOptionsAccess; options?: O; };
export type StrategyVersionType<M = any, S = any> = { scheme: SchemeStrategyType<M>; strategies: { [KS in keyof S]: StrategyOptionsType<S[KS]>; }; };
export type StrategyCommonType<M = any> = { method?: MethodPluginType<M>; };
export type StrategyConfigType = { name: string; version: string; methods?: { [method: string]: {}; }; };
export type StrategyIndex<M = any> = { config: () => Promise<StrategyConfigType>; version: { [version: string]: () => Promise<StrategyVersionType<M>>; }; common: { method?: () => Promise<MethodPluginType<M>>; } };
