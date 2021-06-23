import { MethodPluginType } from './method.type';
import { SchemeStrategyType } from './scheme.type';

export type StrategyVersionType<M = any> = { scheme: SchemeStrategyType<M>; };
export type StrategyCommonType<M = any> = { method?: MethodPluginType<M>; };
export type StrategyConfigType = { name: string; version: string; methods?: { [method: string]: {}; }; };
export type StrategyIndex<M = any> = { config: () => Promise<StrategyConfigType>; version: { [version: string]: () => Promise<StrategyVersionType<M>>; }; common: { method?: () => Promise<MethodPluginType<M>>; } };
